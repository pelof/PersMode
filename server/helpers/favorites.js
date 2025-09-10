import { db } from "./db.js";

export function getFavorites(req) {
  if (req.session.user) {
    return db.prepare("SELECT p.* FROM favorites f JOIN products p ON f.product_SKU = p.product_SKU WHERE f.user_id = ?").all(req.session.user.id);
  } else {
    if (!req.session.favorites) req.session.favorites = [];
    return req.session.favorites;
  }
}
