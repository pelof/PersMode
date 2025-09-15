import fs from "fs"; // filsystem-modul
import path from "path"; // hjälp för att bygga säkra sökvägar
import crypto from "crypto"; // Node.js-modul för kryptering o hashing

export function saveImage(file) {
  const hash = crypto.createHash("md5").update(file.buffer).digest("hex"); // skapar md5-hash av filens innehåll (file.buffer) så filer får unika filnamn
  const ext = path.extname(file.originalname); // Hämtar filändelse från uppladdad fil
  const filename = `${hash}${ext}`; 
  const filePath = path.join(__dirname, "../public/images/products", filename); // Bygger absolut sökväg för stället bilden sparas

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.buffer); // Om filen inte finns redan på sökvägen skapas den
  }
  return filename; //returnerar filnamnet utan sökväg, används senare i db
}

export function deleteImage(filename) {
  const filePath = path.join(__dirname, "../public/images/products", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
