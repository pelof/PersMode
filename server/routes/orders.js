const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const { getOrCreateCart } = require("../helpers/cart");

//TODO: flytta mer logik ut genom att göra en createOrder-helper
router.post("/", (req, res) => {
  const { firstName, lastName, email, street, postalCode, city, newsletter } =
    req.body;

  // Hämta kundvagn
  let cartItems = [];
  if (req.session.user) {
    const cart = getOrCreateCart(req.session.user.id);
    cartItems = db
      .prepare(
        `
      SELECT ci.product_SKU, ci.quantity, p.product_price
      FROM cart_items ci
      JOIN products p ON p.product_SKU = ci.product_SKU
      WHERE ci.cart_id = ?
    `
      )
      .all(cart.id);
  } else {
    cartItems = req.session.cart || [];
    cartItems = cartItems.map((i) => {
      const product = db
        .prepare("SELECT product_price FROM products WHERE product_SKU = ?")
        .get(i.product_SKU);
      return { ...i, price: product.product_price };
    });
  }

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Kundvagnen är tom" });
  }

  // Skapa order
  const result = db
    .prepare(
      `
    INSERT INTO orders (user_id, first_name, last_name, email, street, postal_code, city, newsletter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `
    )
    .run(
      req.session.user ? req.session.user.id : null,
      firstName,
      lastName,
      email,
      street,
      postalCode,
      city,
      newsletter ? 1 : 0
    );

  const orderId = result.lastInsertRowid;

  // Spara orderrader
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_SKU, quantity, price)
    VALUES (?, ?, ?, ?)
  `);
  for (const item of cartItems) {
    insertItem.run(orderId, item.product_SKU, item.quantity, item.price);
  }

  // Töm cart
  if (req.session.user) {
    const cart = getOrCreateCart(req.session.user.id);
    db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cart.id);
  } else {
    req.session.cart = [];
  }

  res.json({ success: true, orderId });
});


module.exports = router;