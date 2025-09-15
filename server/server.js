const express = require("express");
const cors = require("cors"); // behövs när frontend och backend körs på olika domäner
const session = require("express-session");
const path = require("path");
const multer = require("multer");

const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const favoritesRoutes = require("./routes/favorites");
const authRoutes = require("./routes/auth");
const ordersRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Ja till cookies
  })
);

app.use(express.json()); // Express kan tolka JSON i req.body

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

// Pekar på mapparna med bilder. Behövs den första?
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(
  "/images/products",
  express.static(path.join(__dirname, "public/images/products"))
);

// Filuppladdning
const storage = multer.memoryStorage(); //Filer sparas i RAM
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); //Max 5 mb
app.locals.upload = upload; // gör multer åtkomlig för routes genom req.app.locals.upload

// Routes
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api", authRoutes); // login, logout, register, me
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`));

// const Database = require("better-sqlite3");
// // för att interagera med filsystemet
// const fs = require("fs");
// const crypto = require("crypto");
// const bcrypt = require("bcrypt");

// const db = new Database("./db/persmode.db");
// db.pragma("foreign_keys = ON"); //för stöd av foreign key

// function generateSlug(product_name) {
//   return product_name
//     .toLowerCase()
//     .replace(/å/g, "a")
//     .replace(/ä/g, "a")
//     .replace(/ö/g, "o")
//     .replace(/[^a-z0-9]+/g, "-") // Byt ut specialtecken mot "-"
//     .replace(/^-|-$/g, ""); // Ta bort "-" i början eller slutet
// }

// const today = new Date().toISOString().split("T")[0];

// app.get("/api/products", (req, res) => {
//   const { category, q, exclude, limit, random, new: isNew } = req.query;
//   const params = [];
//   // 1=1 gör det enklare att kedja på villkor utan att tänka på första AND
//   // let query = "SELECT * FROM products WHERE 1=1";
//   let query = `
//     SELECT DISTINCT p.* 
//     FROM products p
//     LEFT JOIN product_categories pc ON p.product_SKU = pc.product_SKU
//     WHERE 1=1
//   `;

//   if (isNew === "true") {
//     query +=
//       " AND p.product_published <= ? AND p.product_published >= date('now', '-6 days')";
//     params.push(today);
//   } else {
//     query += " AND p.product_published <= ?";
//     params.push(today);
//   }

//   if (category) {
//     query += " AND pc.category_id = ?";
//     params.push(category);
//   }

//   if (q) {
//     query += " AND (p.product_name LIKE ? OR p.product_description LIKE ?)";
//     params.push(`%${q}%`, `%${q}%`);
//   }

//   if (exclude) {
//     query += " AND p.product_slug != ?";
//     params.push(exclude);
//   }

//   if (random === "true") {
//     query += " ORDER BY RANDOM()";
//   }

//   if (limit) {
//     query += " LIMIT ?";
//     params.push(Number(limit));
//   }

//   try {
//     const products = db.prepare(query).all(...params);
//     res.json(products);
//   } catch (err) {
//     console.error("Fel i /api/products:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/api/products/:slug", (req, res) => {
//   const { slug } = req.params;

//   const product = db
//     .prepare(
//       "SELECT * FROM products WHERE product_published <= ? AND product_slug = ?"
//     )
//     .get(today, slug);

//   if (!product)
//     return res.status(404).json({ error: "Produkten hittades inte " });
//   res.json(product);
// });

// // Hjälpfunktion: hämta eller skapa cart för inloggad användare
// function getOrCreateCart(userId) {
//   let cart = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(userId);
//   if (!cart) {
//     db.prepare("INSERT INTO carts (user_id) VALUES (?)").run(userId);
//     cart = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(userId);
//   }
//   return cart;
// }

// function getCartItems(cartId) {
//   let cartItems = db
//     .prepare(
//       `
//       SELECT ci.product_SKU, ci.quantity, p.product_name, p.product_price, p.product_slug
//       FROM cart_items ci
//       JOIN products p ON p.product_SKU = ci.product_SKU
//       WHERE ci.cart_id = ?
//     `
//     )
//     .all(cartId);

//   return cartItems;
// }

// // Cart

// app.get("/api/cart", (req, res) => {
//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     const items = getCartItems(cart.id);
//     return res.json(items);
//   }

//   // Gäst
//   if (!req.session.cart) req.session.cart = [];
//   const cartWithProducts = req.session.cart.map((item) => {
//     const product = db
//       .prepare(
//         "SELECT product_name, product_slug, product_price FROM products WHERE product_SKU = ?"
//       )
//       .get(item.product_SKU);
//     return { ...item, ...product };
//   });
//   res.json(cartWithProducts);
// });

// app.post("/api/cart/add", (req, res) => {
//   const { product_SKU, quantity = 1 } = req.body;

//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     //Om produkten redan finns i cart hämtas den från cart_items och sparas som variabel
//     const existing = db
//       .prepare("SELECT * FROM cart_items WHERE cart_id = ? AND product_SKU = ?")
//       .get(cart.id, product_SKU);

//     if (existing) {
//       db.prepare(
//         "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?"
//       ).run(quantity, existing.id);
//     } else {
//       db.prepare(
//         "INSERT INTO cart_items (cart_id, product_SKU, quantity) VALUES (?, ?, ?)"
//       ).run(cart.id, product_SKU, quantity);
//     }

//     const items = getCartItems(cart.id);

//     return res.json(items);
//   }

//   // Gäst
//   if (!req.session.cart) req.session.cart = [];
//   const existing = req.session.cart.find((i) => i.product_SKU === product_SKU);
//   if (existing) {
//     existing.quantity += quantity;
//   } else {
//     req.session.cart.push({ product_SKU, quantity });
//   }
//   res.json(req.session.cart);
// });

// // REMOVE from cart
// app.post("/api/cart/remove", (req, res) => {
//   const { product_SKU } = req.body;

//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     db.prepare(
//       "DELETE FROM cart_items WHERE cart_id = ? AND product_SKU = ?"
//     ).run(cart.id, product_SKU);

//     const items = getCartItems(cart.id);

//     return res.json(items);
//   }

//   // Gäst
//   if (!req.session.cart) req.session.cart = [];
//   req.session.cart = req.session.cart.filter(
//     (i) => i.product_SKU !== product_SKU
//   );
//   res.json(req.session.cart);
// });

// // UPDATE quantity
// app.post("/api/cart/update", (req, res) => {
//   const { product_SKU, quantity } = req.body;

//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     db.prepare(
//       "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_SKU = ?"
//     ).run(quantity, cart.id, product_SKU);

//     const items = getCartItems(cart.id);

//     return res.json(items);
//   }

//   // Gäst
//   if (!req.session.cart) req.session.cart = [];
//   const item = req.session.cart.find((i) => i.product_SKU === product_SKU);
//   if (item) item.quantity = quantity;
//   res.json(req.session.cart);
// });

// // CLEAR cart används inte
// // app.post("/api/cart/clear", (req, res) => {
// //   if (req.session.user) {
// //     const cart = getOrCreateCart(req.session.user.id);
// //     db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cart.id);
// //     return res.json([]);
// //   }

// //   req.session.cart = [];
// //   res.json([]);
// // });

// // Hämta favoriter (om inloggad: från db, annars från session)
// //TODO favoriter från session sparas inte i db vid inloggning. står dock inget om det i wireframe
// app.get("/api/favorites", (req, res) => {
//   // från db
//   if (req.session.user) {
//     const favorites = db
//       .prepare(
//         `
//       SELECT p.* FROM favorites f
//       JOIN products p ON p.product_SKU = f.product_SKU
//       WHERE f.user_id = ?
//       `
//       )
//       .all(req.session.user.id);
//     return res.json(favorites);
//   }

//   // Gäst, session
//   if (!req.session.favorites) req.session.favorites = [];
//   if (req.session.favorites.length === 0) return res.json([]);
//   const placeholders = req.session.favorites.map(() => "?").join(",");
//   const products = db
//     .prepare(`SELECT * FROM products WHERE product_SKU IN (${placeholders})`)
//     .all(...req.session.favorites);
//   res.json(products);
// });

// // toggle favorite
// app.post("/api/favorites/toggle", (req, res) => {
//   const { product_SKU } = req.body;

//   //om inloggad
//   if (req.session.user) {
//     const fav = db
//       .prepare("SELECT * FROM favorites WHERE user_id = ? AND product_SKU = ?")
//       .get(req.session.user.id, product_SKU);

//     if (fav) {
//       db.prepare(
//         "DELETE FROM favorites WHERE user_id = ? AND product_SKU = ?"
//       ).run(req.session.user.id, product_SKU);
//       return res.json({ isFavorite: false });
//     } else {
//       db.prepare(
//         "INSERT INTO favorites (user_id, product_SKU) VALUES (?, ?)"
//       ).run(req.session.user.id, product_SKU);
//       return res.json({ isFavorite: true });
//     }
//   }

//   // Gäst, session
//   if (!req.session.favorites) req.session.favorites = [];
//   const index = req.session.favorites.indexOf(product_SKU);
//   if (index >= 0) {
//     // Om produkten redan finns, sätt isFavorite till false
//     req.session.favorites.splice(index, 1);
//     return res.json({ isFavorite: false });
//   } else {
//     // Om produkten inte finns, sätt isFavorite till true
//     req.session.favorites.push(product_SKU);
//     return res.json({ isFavorite: true });
//   }
// });

// app.get("/api/admin/products", (req, res) => {
//   const products = db.prepare("SELECT * FROM products").all();
//   res.json(products);
// });

// app.post("/api/products", upload.single("image"), (req, res) => {
//   const {
//     product_name,
//     product_description,
//     product_brand,
//     product_SKU,
//     product_price,
//     product_published,
//     category_ids,
//   } = req.body;

//   if (
//     !product_name ||
//     !product_description ||
//     !product_brand ||
//     !product_SKU ||
//     !product_price ||
//     !product_published ||
//     !Array.isArray(JSON.parse(category_ids || "[]"))
//   ) {
//     return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
//   }

//   let product_image = null;

//   if (req.file) {
//     // Skapa hash av filens innehåll - för att slippa ha placeholderbilden massa ggr i db. Onödigt vid produktion
//     const hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
//     const ext = path.extname(req.file.originalname);
//     const filename = `${hash}${ext}`;
//     const filePath = path.join(__dirname, "public/images/products", filename);

//     // Spara bara om filen inte redan finns
//     if (!fs.existsSync(filePath)) {
//       fs.writeFileSync(filePath, req.file.buffer);
//     }

//     product_image = filename;
//   }

//   const slug = generateSlug(product_name);

//   try {
//     const stmt = db.prepare(`
//       INSERT INTO products 
//       (product_name, product_description, product_image, product_brand, product_SKU, product_price, product_published, product_slug) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `);
//     stmt.run(
//       product_name,
//       product_description,
//       product_image,
//       product_brand,
//       product_SKU,
//       product_price,
//       product_published,
//       slug
//     );

//     // Koppla kategorier
//     const insertCat = db.prepare(
//       "INSERT INTO product_categories (product_SKU, category_id) VALUES (?, ?)"
//     );
//     for (const catId of JSON.parse(category_ids)) {
//       insertCat.run(product_SKU, catId);
//     }

//     res.status(201).json({ message: "Produkt tillagd!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Något gick fel vid sparandet" });
//   }
// });


// app.delete("/api/admin/products/:sku", (req, res) => {
//   const { sku } = req.params;

//   try {
//     const product = db
//       .prepare("SELECT product_image FROM products WHERE product_SKU = ?")
//       .get(sku);

//     if (!product) {
//       return res.status(404).json({ error: "Produkten hittades inte" });
//     }

//     // Ta bort produkt från databasen
//     const stmt = db.prepare("DELETE FROM products WHERE product_SKU = ?");
//     const info = stmt.run(sku);

//     if (info.changes === 0) {
//       return res.status(404).json({ error: "Produkten hittades inte" });
//     }

//     // Kolla om någon annan använder samma bild innan vi raderar den
//     if (product.product_image) {
//       const otherUsers = db
//         .prepare(
//           "SELECT COUNT(*) as count FROM products WHERE product_image = ?"
//         )
//         .get(product.product_image);

//       if (otherUsers.count === 0) {
//         const filePath = path.join(
//           __dirname,
//           "public/images/products",
//           product.product_image
//         );
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       }
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Ett fel uppstod" });
//   }
// });

// app.get("/api/categories", (req, res) => {
//   const categories = db.prepare("SELECT * FROM categories").all();
//   res.json(categories);
// });

// app.delete("/api/categories/:slug", (req, res) => {
//   const { slug } = req.params;

//   const info = db.prepare("DELETE FROM categories WHERE slug = ?").run(slug);

//   if (info.changes === 0) {
//     return res.status(404).json({ error: "Kategorin hittades inte" });
//   }

//   res.json({ success: true });
// });

// app.post("/api/categories", upload.single("image"), (req, res) => {
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
//   }

//   let image = null;

//   if (req.file) {
//     // Skapa hash av filens innehåll
//     const hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
//     const ext = path.extname(req.file.originalname);
//     const filename = `${hash}${ext}`;
//     const filePath = path.join(__dirname, "public/images/products", filename);

//     // Spara bara om filen inte redan finns
//     if (!fs.existsSync(filePath)) {
//       fs.writeFileSync(filePath, req.file.buffer);
//     }

//     image = filename;
//   }

//   const slug = generateSlug(name);

//   try {
//     const stmt = db.prepare(`
//       INSERT INTO categories 
//       (name, image, slug) 
//       VALUES (?, ?, ?)
//     `);
//     stmt.run(name, image, slug);

//     res.status(201).json({ message: "Kategori tillagd!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Något gick fel vid sparandet" });
//   }
// });


// // Registrera (för test)
// app.post("/api/register", async (req, res) => {
//   const { email, password, role = "user" } = req.body;

//   const hash = await bcrypt.hash(password, 10); // password = lösenordet, 10 = antalet rundor det krypteras (salt)
//   try {
//     db.prepare(
//       "INSERT INTO users (email, password, role) VALUES (?, ?, ?)"
//     ).run(email, hash, role);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(400).json({ error: "User already exists" });
//   }
// });

// // Login
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = db.prepare("SELECT * FROM users where email = ?").get(email);

//   if (!user) return res.status(401).json({ error: "Invalid credentials" });

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return res.status(401).json({ error: "Invalid credentials" });

//   req.session.user = { id: user.id, email: user.email, role: user.role };
//   res.json({ success: true, user: req.session.user });
// });

// // Logout

// app.post("/api/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.json({ success: true });
//   });
// });

// app.get("/api/me", (req, res) => {
//   if (!req.session.user) {
//     return res.json(null);
//   }
//   res.json(req.session.user);
// });

// // Middleware för skydd
// function requireLogin(req, res, next) {
//   if (!req.session.user)
//     return res.status(401).json({ error: "Inte inloggad" });
//   next();
// }

// function requireAdmin(req, res, next) {
//   if (!req.session.user || req.session.user.role !== "admin") {
//     return res.status(403).json({ error: "Endast för admins" });
//   }
//   next();
// }

// app.post("/api/orders", (req, res) => {
//   const { firstName, lastName, email, street, postalCode, city, newsletter } =
//     req.body;

//   // Hämta kundvagn
//   let cartItems = [];
//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     cartItems = db
//       .prepare(
//         `
//       SELECT ci.product_SKU, ci.quantity, p.product_price
//       FROM cart_items ci
//       JOIN products p ON p.product_SKU = ci.product_SKU
//       WHERE ci.cart_id = ?
//     `
//       )
//       .all(cart.id);
//   } else {
//     cartItems = req.session.cart || [];
//     cartItems = cartItems.map((i) => {
//       const product = db
//         .prepare("SELECT product_price FROM products WHERE product_SKU = ?")
//         .get(i.product_SKU);
//       return { ...i, price: product.product_price };
//     });
//   }

//   if (cartItems.length === 0) {
//     return res.status(400).json({ error: "Kundvagnen är tom" });
//   }

//   // Skapa order
//   const result = db
//     .prepare(
//       `
//     INSERT INTO orders (user_id, first_name, last_name, email, street, postal_code, city, newsletter)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `
//     )
//     .run(
//       req.session.user ? req.session.user.id : null,
//       firstName,
//       lastName,
//       email,
//       street,
//       postalCode,
//       city,
//       newsletter ? 1 : 0
//     );

//   const orderId = result.lastInsertRowid;

//   // Spara orderrader
//   const insertItem = db.prepare(`
//     INSERT INTO order_items (order_id, product_SKU, quantity, price)
//     VALUES (?, ?, ?, ?)
//   `);
//   for (const item of cartItems) {
//     insertItem.run(orderId, item.product_SKU, item.quantity, item.price);
//   }

//   // Töm cart
//   if (req.session.user) {
//     const cart = getOrCreateCart(req.session.user.id);
//     db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(cart.id);
//   } else {
//     req.session.cart = [];
//   }

//   res.json({ success: true, orderId });
// });

