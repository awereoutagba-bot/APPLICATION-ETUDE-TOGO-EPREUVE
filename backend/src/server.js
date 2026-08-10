require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const epreuvesRoutes = require("./routes/epreuves.routes");
const documentsRoutes = require("./routes/documents.routes");
const apcGuideRoutes = require("./routes/apcGuide.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers uploadés (utile en dev ; en prod préférer un stockage objet type S3)
app.use("/fichiers", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/sante", (_req, res) => res.json({ statut: "ok", app: "Etude Togo" }));

app.use("/api/auth", authRoutes);
app.use("/api/epreuves", epreuvesRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/apc-guide", apcGuideRoutes);
app.use("/api/users", usersRoutes);

// Gestion des erreurs multer / erreurs générales
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.message && err.message.includes("non autorisé")) {
    return res.status(400).json({ erreur: err.message });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ erreur: "Fichier trop volumineux." });
  }
  res.status(500).json({ erreur: "Une erreur est survenue sur le serveur." });
});

app.use((_req, res) => res.status(404).json({ erreur: "Route introuvable." }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API Etude Togo démarrée sur http://localhost:${PORT}`);
});
