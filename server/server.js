const express = require("express");
const cors = require("cors");
const app = express();
const Database = require("better-sqlite3");

const db = new Database("./db/persmode.db");

app.use(cors());
app.use(express.json());

const today = new Date().toISOString().split("T")[0];

app.get("/api/products", (req, res) => {
  const { category, q } = req.query;
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

  const products = db.prepare(query).all(...params);
  res.json(products);
});

app.get("/api/products/:slug", (req, res) => {
    const { slug } = req.params;
    console.log("query med slug:", slug);

    const product = db.prepare("SELECT * FROM products WHERE product_published <= ? AND product_slug = ?").get(today, slug);

    if (!product) return res.status(404).json({error: "Produkten hittades inte "});
    res.json(product)
})


app.get("/api/admin/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  res.json(products);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`));
