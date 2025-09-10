const db = require("./db.js");

function getCart(req) {
  if (req.session.user) return getOrCreateCart(req.session.user.id);
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

// Hjälpfunktion: hämta eller skapa cart för inloggad användare
function getOrCreateCart(userId) {
  let cart = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(userId);
  if (!cart) {
    db.prepare("INSERT INTO carts (user_id) VALUES (?)").run(userId);
    cart = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(userId);
  }
  return cart;
}

function getCartItems(cartId) {
  let cartItems = db
    .prepare(
      `
      SELECT ci.product_SKU, ci.quantity, p.product_name, p.product_price, p.product_slug
      FROM cart_items ci
      JOIN products p ON p.product_SKU = ci.product_SKU
      WHERE ci.cart_id = ?
    `
    )
    .all(cartId);

  return cartItems;
}



module.exports = { getCart, getCartItems, getOrCreateCart };