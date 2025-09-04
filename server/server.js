const express = require("express");
const cors = require("cors");
const app = express();
const Database = require("better-sqlite3");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
// för att interagera med filsystemet
const fs = require("fs");
const crypto = require("crypto");


const db = new Database("./db/persmode.db");
db.pragma("foreign_keys = ON"); //för stöd av foreign key

app.use(
  session({
    secret: "hemlig hemlighet",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 dag
  })
);

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/images/products", express.static(path.join(__dirname, "public/images/products")));


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// Multer storage med hash-baserat filnamn
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "public/images/products"));
//   },
//   filename: function (req, file, cb) {
//     // Läs hela filen i minne
//     const fileBuffer = file.buffer || null;

//     if (fileBuffer) {
//       // Om filen redan är buffrad (multer kan ibland ge detta direkt)
//       const hash = crypto.createHash("md5").update(fileBuffer).digest("hex");
//       const ext = path.extname(file.originalname);
//       cb(null, `${hash}${ext}`);
//     } else {
//       // Om bufferten inte finns: skapa hash av originalnamn + size som fallback
//       const hash = crypto
//         .createHash("md5")
//         .update(file.originalname + Date.now())
//         .digest("hex");
//       const ext = path.extname(file.originalname);
//       cb(null, `${hash}${ext}`);
//     }
//   },
// });

// // Viktigt: använd `storage` + `limits` så multer faktiskt sparar filen
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB
// });

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function generateSlug(product_name) {
  return product_name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-") // Byt ut specialtecken mot "-"
    .replace(/^-|-$/g, ""); // Ta bort "-" i början eller slutet
}

const today = new Date().toISOString().split("T")[0];

app.get("/api/products", (req, res) => {
  const { category, q, exclude, limit, random, new: isNew } = req.query;
  const params = [];
  // 1=1 gör det enklare att kedja på villkor utan att tänka på första AND
  // let query = "SELECT * FROM products WHERE 1=1";
    let query = `
    SELECT DISTINCT p.* 
    FROM products p
    LEFT JOIN product_categories pc ON p.product_SKU = pc.product_SKU
    WHERE 1=1
  `;

  if (isNew === "true") {
    query +=
      " AND p.product_published <= ? AND p.product_published >= date('now', '-6 days')";
    params.push(today);
  } else {
    query += " AND p.product_published <= ?";
    params.push(today);
  }

  if (category) {
    query += " AND pc.category_id = ?";
    params.push(category);
  }

  if (q) {
    query += " AND (p.product_name LIKE ? OR p.product_description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  if (exclude) {
    query += " AND p.product_slug != ?";
    params.push(exclude);
  }

  if (random === "true") {
    query += " ORDER BY RANDOM()";
  }
  // else {
  //   query += " ORDER BY product_published DESC"; //fallback-sortering DESC = descending, alltså nyaste först
  // }

  if (limit) {
    query += " LIMIT ?";
    params.push(Number(limit));
  }

  try {
    const products = db.prepare(query).all(...params);
    res.json(products);
  } catch (err) {
    console.error("Fel i /api/products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/products/:slug", (req, res) => {
  const { slug } = req.params;

  const product = db
    .prepare(
      "SELECT * FROM products WHERE product_published <= ? AND product_slug = ?"
    )
    .get(today, slug);

  if (!product)
    return res.status(404).json({ error: "Produkten hittades inte " });
  res.json(product);
});

// Cart
// app.get("/api/cart", (req, res) => {
//     console.log("Session:", req.session);
//   res.json(req.session.cart || []);
// })

// app.post("/api/cart/add", (req, res) => {
//   const { productId, quantity = 1 } = req.body;
//   if (!req.session.cart) req.session.cart = []

//   const existing = req.session.cart.find(item => item.productId === productId);
//   if (existing) {
//     existing.quantity += quantity;
//   } else {
//     req.session.cart.push({ productId, quantity });
//   }

//   res.json({ cart: req.session.cart });
//   console.log({cart: req.session.cart})
// })

// app.post("/api/cart/remove", (req, res) => {
//   const { productId } = req.body;

//   if (!req.session.cart) req.session.cart = [];

//   req.session.cart = req.session.cart.filter(item => item.productId !== productId);

//   res.json({ cart: req.session.cart });

// });

// app.post("/api/cart/clear", (req, res) => {
//   req.session.cart = [];
//   res.json({ cart: [] });
// });

app.get("/api/cart", (req, res) => {
  if (!req.session.cart) req.session.cart = [];

  const cartWithProducts = req.session.cart.map((item) => {
    const product = db
      .prepare(
        "SELECT product_name, product_slug, product_price FROM products WHERE product_SKU = ?"
      )
      .get(item.product_SKU);

    return {
      ...item,
      ...product, //Lägger på namn, pris, slug osv
    };
  });

  res.json(cartWithProducts);
});

app.post("/api/cart/add", (req, res) => {
  const { product_SKU, quantity = 1 } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(
    (item) => item.product_SKU === product_SKU
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    req.session.cart.push({ product_SKU, quantity });
  }

  res.json(req.session.cart);
});

app.post("/api/cart/remove", (req, res) => {
  const { product_SKU } = req.body;
  if (!req.session.cart) req.session.cart = [];

  req.session.cart = req.session.cart.filter(
    (item) => item.product_SKU !== product_SKU
  );
  res.json(req.session.cart);
});

app.post("/api/cart/update", (req, res) => {
  const { product_SKU, quantity } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const item = req.session.cart.find((i) => i.product_SKU === product_SKU);
  if (item) {
    item.quantity = quantity;
  }

  res.json(req.session.cart);
});

app.post("/api/cart/clear", (req, res) => {
  req.session.cart = [];
  res.json([]);
});

app.get("/api/favorites", (req, res) => {
  if (!req.session.favorites) req.session.favorites = [];

  const placeholders = req.session.favorites.map(() => "?").join(",");
  let products = [];

  if (placeholders.length > 0) {
    products = db
      .prepare(`SELECT * FROM products WHERE product_SKU IN (${placeholders})`)
      .all(...req.session.favorites);
  }

  res.json(products);
});

app.post("/api/favorites/toggle", (req, res) => {
  const { product_SKU } = req.body;
  if (!req.session.favorites) req.session.favorites = [];

  const index = req.session.favorites.indexOf(product_SKU);
  if (index >= 0) {
    // Om produkten redan finns, sätt isFavorite till false
    req.session.favorites.splice(index, 1);
    return res.json({ isFavorite: false, favorites: req.session.favorites });
  } else {
    // Om produkten inte finns, sätt isFavorite till true
    req.session.favorites.push(product_SKU);
    return res.json({ isFavorite: true, favorites: req.session.favorites });
  }
});

app.get("/api/admin/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

// för lägga till en produkt
// app.post("/api/products", upload.single("image"), (req, res) => {
//   const {
//     product_name,
//     product_description,
//     product_image,
//     product_brand,
//     product_SKU,
//     product_price,
//     product_published,
//     category_ids,
//   } = req.body;

//   if (
//     !product_name ||
//     !product_description ||
//     !product_image ||
//     !product_brand ||
//     !product_SKU ||
//     !product_price ||
//     !product_published ||
//     !Array.isArray(category_ids)
//   ) {
//     return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
//   }



//   try {
//     const slug = generateSlug(product_name);

//     const stmt = db.prepare(`
//       INSERT INTO products (product_name, product_description, product_image, product_brand, product_SKU, product_price, product_published, product_slug) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `);


//     stmt.run(
//       product_name,
//       product_description,
//       product_image,
//       product_brand,
//       product_SKU,
//       product_price,
//       product_published,
//       slug
//     );

//         // Koppla kategorier
//     const insertCat = db.prepare(
//       "INSERT INTO product_categories (product_SKU, category_id) VALUES (?, ?)"
//     );
//     for (const catId of category_ids) {
//       insertCat.run(product_SKU, catId);
//     }

//     res.status(201).json({ message: "Produkt tillagd!" });
//   } catch (error) {
//     console.error("Fel vid tillägg av produkt:", error);
//     res.status(500).json({ error: "Något gick fel vid sparandet" });
//   }
// });

app.post("/api/products", upload.single("image"), (req, res) => {
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

  // const product_image = req.file ? `/public/images/products/${req.file.filename}` : null;
  // const product_image = req.file ? req.file.filename : null;

  let product_image = null;

  // if (req.file) {
  //   const filePath = path.join(__dirname, "public/images/products", req.file.filename);

  //   if (fs.existsSync(filePath)) {
  //     // Filen finns redan, använd samma namn
  //     product_image = req.file.filename;
  //   } else {
  //     // Detta borde inte hända, men fallback
  //     product_image = req.file.filename;
  //   }
  // }

if (req.file) {
    // Skapa hash av filens innehåll
    const hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
    const ext = path.extname(req.file.originalname);
    const filename = `${hash}${ext}`;
    const filePath = path.join(__dirname, "public/images/products", filename);

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

app.get("/api/categories", (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});
app.delete("/api/categories/:slug", (req, res) => {
  const { slug } = req.params;

  const info = db.prepare("DELETE FROM categories WHERE slug = ?").run(slug);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Kategorin hittades inte" });
  }

  res.json({ success: true });
});

// app.delete("/api/admin/products/:sku", (req, res) => {
//   const { sku } = req.params;

//   // Hämta filnamn för bild
//   try {
//     const product = db.prepare("SELECT product_image FROM products WHERE product_SKU = ?").get(sku);

//     if (!product) {
//       return res.status(404).json({ error: "Produkten hittades inte" });
//     }
//     // Ta bort produkt från databas
//     const stmt = db.prepare("DELETE FROM products WHERE product_SKU = ?");
//     const info = stmt.run(sku);
  
//     if (info.changes === 0) {
//       return res.status(404).json({ error: "Produkten hittades inte" });
//     }
//     // Ta bort filen från disk om den finns
//     if (product.product_image) {
//       const filePath = path.join(__dirname, "public/images/products", product.product_image);
      
//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error("Kunde inte ta bort bildfil:", err)
//         }
//       });

//     }
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Fel vid borttagning av produkt:", err);
//     res.status(500).json({ error: "Ett fel uppstod" });
//   }
// });
app.delete("/api/admin/products/:sku", (req, res) => {
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
        .prepare("SELECT COUNT(*) as count FROM products WHERE product_image = ?")
        .get(product.product_image);

      // if (otherUsers.count === 0) {
      //   const filePath = path.join(
      //     __dirname,
      //     "public/images/products",
      //     product.product_image
      //   );

      //   fs.unlink(filePath, (err) => {
      //     if (err) console.error("Kunde inte ta bort bildfil:", err);
      //   });
      // }
    if (otherUsers.count === 0) {
        const filePath = path.join(__dirname, "public/images/products", product.product_image);
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


const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`));
