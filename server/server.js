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
const bcrypt = require("bcrypt");

const db = new Database("./db/persmode.db");
db.pragma("foreign_keys = ON"); //för stöd av foreign key

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "hemlig hemlighet",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 dag
      sameSite: "lax",
      httpOnly: true,
    },
  })
);
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(
  "/images/products",
  express.static(path.join(__dirname, "public/images/products"))
);


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

// Hämta favoriter (om inloggad: från db, annars från session)
//TODO favoriter från session sparas inte i db vid inloggning. står dock inget om det i wireframe
app.get("/api/favorites", (req, res) => {
  // från db
  if (req.session.user) {
    const favorites = db
      .prepare(
        `
      SELECT p.* FROM favorites f
      JOIN products p ON p.product_SKU = f.product_SKU
      WHERE f.user_id = ?
      `
      )
      .all(req.session.user.id);
    return res.json(favorites);
  }

  // Gäst, session
  if (!req.session.favorites) req.session.favorites = [];
  if (req.session.favorites.length === 0) return res.json([]);
  const placeholders = req.session.favorites.map(() => "?").join(",");
  const products = db
    .prepare(`SELECT * FROM products WHERE product_SKU IN (${placeholders})`)
    .all(...req.session.favorites);
  res.json(products);
});

// toggle favorite
app.post("/api/favorites/toggle", (req, res) => {
  const { product_SKU } = req.body;

  //om inloggad
  if (req.session.user) {
    const fav = db
      .prepare("SELECT * FROM favorites WHERE user_id = ? AND product_SKU = ?")
      .get(req.session.user.id, product_SKU);

    if (fav) {
      db.prepare(
        "DELETE FROM favorites WHERE user_id = ? AND product_SKU = ?"
      ).run(req.session.user.id, product_SKU);
      return res.json({ isFavorite: false });
    } else {
      db.prepare(
        "INSERT INTO favorites (user_id, product_SKU) VALUES (?, ?)"
      ).run(req.session.user.id, product_SKU);
      return res.json({ isFavorite: true });
    }
  }

  // Gäst, session
  if (!req.session.favorites) req.session.favorites = [];
  const index = req.session.favorites.indexOf(product_SKU);
  if (index >= 0) {
    // Om produkten redan finns, sätt isFavorite till false
    req.session.favorites.splice(index, 1);
    return res.json({ isFavorite: false });
  } else {
    // Om produkten inte finns, sätt isFavorite till true
    req.session.favorites.push(product_SKU);
    return res.json({ isFavorite: true });
  }
});

app.get("/api/admin/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

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

  let product_image = null;

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

app.post("/api/categories", upload.single("image"), (req, res) => {
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
    const filePath = path.join(__dirname, "public/images/products", filename);

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
        .prepare(
          "SELECT COUNT(*) as count FROM products WHERE product_image = ?"
        )
        .get(product.product_image);

      if (otherUsers.count === 0) {
        const filePath = path.join(
          __dirname,
          "public/images/products",
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

// Registrera (för test)
app.post("/api/register", async (req, res) => {
  const { email, password, role = "user" } = req.body;

  const hash = await bcrypt.hash(password, 10); // password = lösenordet, 10 = antalet rundor det krypteras (salt)
  try {
    db.prepare(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)"
    ).run(email, hash, role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users where email = ?").get(email);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  req.session.user = { id: user.id, email: user.email, role: user.role };
  res.json({ success: true, user: req.session.user });
});

// Logout

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get("/api/me", (req, res) => {
  if (!req.session.user) {
    return res.json(null);
  }
  res.json(req.session.user);
});

// Middleware för skydd
function requireLogin(req, res, next) {
  if (!req.session.user)
    return res.status(401).json({ error: "Inte inloggad" });
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Endast för admins" });
  }
  next();
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`));
