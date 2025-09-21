const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const upload = require("../helpers/upload");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

function generateSlug(product_name) {
  return product_name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-") // Byt ut specialtecken mot "-"
    .replace(/^-|-$/g, ""); // Ta bort "-" i början eller slutet
}

router.get("/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

router.post("/products", upload.single("image"), (req, res) => {
  const {
    product_name,
    product_description,
    product_brand,
    product_SKU,
    product_price,
    product_published,
    category_ids,
  } = req.body;

  if (
    !product_name ||
    !product_description ||
    !product_brand ||
    !product_SKU ||
    !product_price ||
    !product_published ||
    !Array.isArray(JSON.parse(category_ids || "[]"))
  ) {
    return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
  }

  let product_image = null;

  if (req.file) {
    // Skapa hash av filens innehåll - för att slippa ha placeholderbilden massa ggr i db. Onödigt vid produktion
    const hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
    const ext = path.extname(req.file.originalname);
    const filename = `${hash}${ext}`;
    const filePath = path.join(
      __dirname,
      "../public/images/products",
      filename
    );

    // Spara bara om filen inte redan finns
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, req.file.buffer);
    }

    product_image = filename;
  }

  const slug = generateSlug(product_name);

  try {
    const stmt = db.prepare(`
      INSERT INTO products 
      (product_name, product_description, product_image, product_brand, product_SKU, product_price, product_published, product_slug) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      product_name,
      product_description,
      product_image,
      product_brand,
      product_SKU,
      product_price,
      product_published,
      slug
    );

    // Koppla kategorier
    const insertCat = db.prepare(
      "INSERT INTO product_categories (product_SKU, category_id) VALUES (?, ?)"
    );
    for (const catId of JSON.parse(category_ids)) {
      insertCat.run(product_SKU, catId);
    }

    res.status(201).json({ message: "Produkt tillagd!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Något gick fel vid sparandet" });
  }
});

router.delete("/products/:sku", (req, res) => {
  const { sku } = req.params;

  try {
    const product = db
      .prepare("SELECT product_image FROM products WHERE product_SKU = ?")
      .get(sku);

    if (!product) {
      return res.status(404).json({ error: "Produkten hittades inte" });
    }

    // Ta bort produkt från databasen
    const stmt = db.prepare("DELETE FROM products WHERE product_SKU = ?");
    const info = stmt.run(sku);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Produkten hittades inte" });
    }

    // Kolla om någon annan använder samma bild innan vi raderar den
    if (product.product_image) {
      const otherUsers = db
        .prepare(
          "SELECT COUNT(*) as count FROM products WHERE product_image = ?"
        )
        .get(product.product_image);

      if (otherUsers.count === 0) {
        const filePath = path.join(
          __dirname,
          "../public/images/products",
          product.product_image
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ett fel uppstod" });
  }
});

router.get("/categories", (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});
//TODO Bugg: när man misslyckades med att skapa ny kategori blev man utloggad
router.post("/categories", upload.single("image"), (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
  }

  let image = null;

  if (req.file) {
    // Skapa hash av filens innehåll
    const hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
    const ext = path.extname(req.file.originalname);
    const filename = `${hash}${ext}`;
    const filePath = path.join(
      __dirname,
      "../public/images/categories",
      filename
    );

    // Spara bara om filen inte redan finns
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, req.file.buffer);
    }

    image = filename;
  }

  const slug = generateSlug(name);

  try {
    const stmt = db.prepare(`
      INSERT INTO categories 
      (name, image, slug) 
      VALUES (?, ?, ?)
    `);
    stmt.run(name, image, slug);

    res.status(201).json({ message: "Kategori tillagd!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Något gick fel vid sparandet" });
  }
});

router.delete("/categories/:slug", (req, res) => {
  const { slug } = req.params;

  try {
    const category = db
      .prepare("SELECT image FROM categories WHERE slug = ?")
      .get(slug);

    if (!category) {
      return res.status(404).json({ error: "Kategorin hittades inte" });
    }

    // Ta bort kategorin från databasen
    const stmt = db.prepare("DELETE FROM categories WHERE slug = ?");
    const info = stmt.run(slug);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Kategorin hittades inte" });
    }

    // Kolla om någon annan använder samma bild innan vi raderar den
    if (category.image) {
      const otherUsers = db
        .prepare("SELECT COUNT(*) as count FROM categories WHERE image = ?")
        .get(category.image);

      if (otherUsers.count === 0) {
        const filePath = path.join(
          __dirname,
          "../public/images/categories",
          category.image
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ett fel uppstod" });
  }

});

module.exports = router;
