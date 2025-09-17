const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const bcrypt = require("bcrypt");

// Allt relaterat till login/register

// Registrera (för test)
router.post("/register", async (req, res) => {
  const { email, password, role = "user" } = req.body;

  const hash = await bcrypt.hash(password, 10); // password = lösenordet, 10 = antalet rundor det krypteras (salt)
  try {
    db.prepare(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)"
    ).run(email, hash, role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users where email = ?").get(email);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  req.session.user = { id: user.id, email: user.email, role: user.role };
  res.json({ success: true, user: req.session.user });
});

// Logout

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.json(null);
  }
  res.json(req.session.user);
});

module.exports = router;