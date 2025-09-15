const express = require("express");
const router = express.Router();
const db = require("../helpers/db");

router.get("/", (req, res) => {
  const { category, q, exclude, limit, random, new: isNew } = req.query;
  const params = [];
  const today = new Date().toISOString().split("T")[0];
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

router.get("/:slug", (req, res) => {
  const { slug } = req.params;
  const today = new Date().toISOString().split("T")[0];

  const product = db
    .prepare(
      "SELECT * FROM products WHERE product_published <= ? AND product_slug = ?"
    )
    .get(today, slug);

  if (!product)
    return res.status(404).json({ error: "Produkten hittades inte " });
  res.json(product);
});

module.exports = router;
