import fs from "fs";
import path from "path";
import crypto from "crypto";

export function saveImage(file) {
  const hash = crypto.createHash("md5").update(file.buffer).digest("hex");
  const ext = path.extname(file.originalname);
  const filename = `${hash}${ext}`;
  const filePath = path.join(__dirname, "../public/images/products", filename);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.buffer);
  }
  return filename;
}

export function deleteImage(filename) {
  const filePath = path.join(__dirname, "../public/images/products", filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}
