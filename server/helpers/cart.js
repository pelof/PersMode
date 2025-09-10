import { db } from "./db.js";

export function getCart(req) {
  if (req.session.user) return getOrCreateCart(req.session.user.id);
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}
