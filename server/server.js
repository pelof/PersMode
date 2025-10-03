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
      // sameSite: "lax",
      sameSite: false,
      httpOnly: true,
    },
  })
);

// Pekar på mapparna med bilder.
app.use("/images/categories", express.static(path.join(__dirname, "public/images/categories")));
app.use(
  "/images/products",
  express.static(path.join(__dirname, "public/images/products"))
);

// Filuppladdning är nog duplicerat i helper upload
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