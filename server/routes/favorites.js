const express = require("express");
const router = express.Router();
const db = require("../helpers/db");


// Hämta favoriter (om inloggad: från db, annars från session)
//TODO favoriter från session sparas inte i db vid inloggning. står dock inget om det i wireframe
router.get("/", (req, res) => {
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
router.post("/toggle", (req, res) => {
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


module.exports = router;