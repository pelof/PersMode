const express = require("express");
const cors = require("cors");
const app = express();
const Database = require("better-sqlite3");
const session = require("express-session");

const db = new Database("./db/persmode.db");

app.use(session({
  secret:"hemlig hemlighet",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 1 dag
}))

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const today = new Date().toISOString().split("T")[0];

app.get("/api/products", (req, res) => {
  const { category, q, exclude, limit, random, new: isNew } = req.query;
  const params = [today];

  let query = "SELECT * FROM products WHERE product_published <= ?";

  if (category) {
    query += " AND product_category = ?";
    params.push(category);
  }

  if (q) {
    query += " AND (product_name LIKE ? OR product_description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  if (isNew === "true"){
    query += " AND product_published >= date('now', '-7 days')";
    console.log(query)
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

    const product = db.prepare("SELECT * FROM products WHERE product_published <= ? AND product_slug = ?").get(today, slug);

    if (!product) return res.status(404).json({error: "Produkten hittades inte "});
    res.json(product)
})

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

 const cartWithProducts = req.session.cart.map(item => {
  const product = db.prepare(
    "SELECT product_name, product_slug, product_price FROM products WHERE product_SKU = ?"
  ).get(item.product_SKU);

  return {
    ...item,
    ...product, //Lägger på namn, pris, slug osv
  }
 });

  res.json(cartWithProducts);
});

app.post("/api/cart/add", (req, res) => {
  const { product_SKU, quantity = 1 } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(item => item.product_SKU === product_SKU);
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

  req.session.cart = req.session.cart.filter(item => item.product_SKU !== product_SKU);
  res.json(req.session.cart);
});

app.post("/api/cart/clear", (req, res) => {
  req.session.cart = [];
  res.json([]);
});

app.get("/api/admin/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

app.delete("/api/admin/products/:sku", (req, res) => {
  const { sku } = req.params;

  const stmt = db.prepare("DELETE FROM products WHERE product_SKU = ?")
  const info = stmt.run(sku);

  if (info.changes === 0) {
      return res.status(404).json({ error: "Produkten hittades inte" });
  }
  res.json({success: true})
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`));
