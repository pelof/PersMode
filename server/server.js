const express = require("express");
const cors = require("cors");
const app = express();
const Database = require("better-sqlite3");
const session = require("express-session");
const multer = require("multer");
const path = require("path");

const db = new Database("./db/persmode.db");

app.use(
  session({
    secret: "hemlig hemlighet",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 1 dag
  })
);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Multer inställningar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images/products"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

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
  let query = "SELECT * FROM products WHERE 1=1";

  if (isNew === "true") {
    query +=
      " AND product_published <= ? AND product_published >= date('now', '-6 days')";
    params.push(today);
  } else {
    query += " AND product_published <= ?";
    params.push(today);
  }

  if (category) {
    query += " AND product_category = ?";
    params.push(category);
  }

  if (q) {
    query += " AND (product_name LIKE ? OR product_description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  if (exclude) {
    query += " AND product_slug != ?";
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

  const products = db.prepare(query).all(...params);
  res.json(products);
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

  const product_image = req.file ? `/public/images/products/${req.file.filename}` : null;
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

app.delete("/api/admin/products/:sku", (req, res) => {
  const { sku } = req.params;

  const stmt = db.prepare("DELETE FROM products WHERE product_SKU = ?");
  const info = stmt.run(sku);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Produkten hittades inte" });
  }
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`));
