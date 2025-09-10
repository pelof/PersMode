const express = require("express");
const router = express.Router();
const db = require("../helpers/db");

router.get("/", (req, res) => {
  if (req.session.user) {
    const cart = getOrCreateCart(req.session.user.id);
    const items = getCartItems(cart.id);
    return res.json(items);
  }

  // Gäst
  if (!req.session.cart) req.session.cart = [];
  const cartWithProducts = req.session.cart.map((item) => {
    const product = db
      .prepare(
        "SELECT product_name, product_slug, product_price FROM products WHERE product_SKU = ?"
      )
      .get(item.product_SKU);
    return { ...item, ...product };
  });
  res.json(cartWithProducts);
});

router.post("/add", (req, res) => {
  const { product_SKU, quantity = 1 } = req.body;

  if (req.session.user) {
    const cart = getOrCreateCart(req.session.user.id);
    //Om produkten redan finns i cart hämtas den från cart_items och sparas som variabel
    const existing = db
      .prepare("SELECT * FROM cart_items WHERE cart_id = ? AND product_SKU = ?")
      .get(cart.id, product_SKU);

    if (existing) {
      db.prepare(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?"
      ).run(quantity, existing.id);
    } else {
      db.prepare(
        "INSERT INTO cart_items (cart_id, product_SKU, quantity) VALUES (?, ?, ?)"
      ).run(cart.id, product_SKU, quantity);
    }

    const items = getCartItems(cart.id);

    return res.json(items);
  }

  // Gäst
  if (!req.session.cart) req.session.cart = [];
  const existing = req.session.cart.find((i) => i.product_SKU === product_SKU);
  if (existing) {
    existing.quantity += quantity;
  } else {
    req.session.cart.push({ product_SKU, quantity });
  }
  res.json(req.session.cart);
});

// REMOVE from cart
router.post("/remove", (req, res) => {
  const { product_SKU } = req.body;

  if (req.session.user) {
    const cart = getOrCreateCart(req.session.user.id);
    db.prepare(
      "DELETE FROM cart_items WHERE cart_id = ? AND product_SKU = ?"
    ).run(cart.id, product_SKU);

    const items = getCartItems(cart.id);

    return res.json(items);
  }

  // Gäst
  if (!req.session.cart) req.session.cart = [];
  req.session.cart = req.session.cart.filter(
    (i) => i.product_SKU !== product_SKU
  );
  res.json(req.session.cart);
});

// UPDATE quantity
router.post("/update", (req, res) => {
  const { product_SKU, quantity } = req.body;

  if (req.session.user) {
    const cart = getOrCreateCart(req.session.user.id);
    db.prepare(
      "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_SKU = ?"
    ).run(quantity, cart.id, product_SKU);

    const items = getCartItems(cart.id);

    return res.json(items);
  }

  // Gäst
  if (!req.session.cart) req.session.cart = [];
  const item = req.session.cart.find((i) => i.product_SKU === product_SKU);
  if (item) item.quantity = quantity;
  res.json(req.session.cart);
});

// CLEAR cart används inte
// app.post("/api/cart/clear", (req, res) => {
//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cart.id);
//     return res.json([]);
//   }

//   req.session.cart = [];
//   res.json([]);
// });

module.exports = router;
