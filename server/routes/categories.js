const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const upload = require("../helpers/upload");

// //Finns i admin
// router.get("/", (req, res) => {
//   const categories = db.prepare("SELECT * FROM categories").all();
//   res.json(categories);
// });

router.delete("/:slug", (req, res) => {
  const { slug } = req.params;

  const info = db.prepare("DELETE FROM categories WHERE slug = ?").run(slug);

  if (info.changes === 0) {
    return res.status(404).json({ error: "Kategorin hittades inte" });
  }

  res.json({ success: true });
});

router.post("/", upload.single("image"), (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Alla fält måste vara ifyllda" });
  }

  let image = null;

  if (req.file) {
    // Skapa hash av filens innehåll
    const hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
    const ext = path.extname(req.file.originalname);
    const filename = `${hash}${ext}`;
    const filePath = path.join(__dirname, "public/images/products", filename);

    // Spara bara om filen inte redan finns
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, req.file.buffer);
    }

    image = filename;
  }

  const slug = generateSlug(name);

  try {
    const stmt = db.prepare(`
      INSERT INTO categories 
      (name, image, slug) 
      VALUES (?, ?, ?)
    `);
    stmt.run(name, image, slug);

    res.status(201).json({ message: "Kategori tillagd!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Något gick fel vid sparandet" });
  }
});

module.exports = router