const express = require("express");
const cors = require("cors");
const app = express();
const Database= require("better-sqlite3")

const db = new Database("./db/persmode.db");

app.use(cors());
app.use(express.json());

const today = new Date().toISOString().split("T")[0];


app.get("/api/products", (req, res) => {

    const products = db.prepare("SELECT * FROM products WHERE product_published <=?").all(today);
    res.json(products);
});

app.get("/api/admin/products", (req, res) => {

    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);

});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server kör på http://localhost:${PORT}`))