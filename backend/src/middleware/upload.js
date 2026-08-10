const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const EXTENSIONS_AUTORISEES = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const suffixe = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${suffixe}${ext}`);
  },
});

function filtreFichier(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!EXTENSIONS_AUTORISEES.includes(ext)) {
    return cb(new Error("Format de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, JPG, PNG."));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter: filtreFichier,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 15 * 1024 * 1024 },
});

module.exports = { upload, UPLOAD_DIR };
