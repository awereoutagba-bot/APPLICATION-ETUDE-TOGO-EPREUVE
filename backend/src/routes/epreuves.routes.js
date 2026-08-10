const express = require("express");
const path = require("path");
const fs = require("fs");
const prisma = require("../prisma");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

const AUTEUR_SELECT = {
  select: { id: true, nom: true, prenom: true, role: true, etablissement: true },
};

// GET /api/epreuves - liste avec filtres et recherche
// query: matiere, niveau, annee, type, serie, q (recherche texte), page, taille
router.get("/", optionalAuth, async (req, res) => {
  try {
    const { matiere, niveau, annee, type, serie, q, page = 1, taille = 20 } = req.query;

    const ou = {
      AND: [
        matiere ? { matiere: { equals: matiere } } : {},
        niveau ? { niveau: { equals: niveau } } : {},
        annee ? { annee: Number(annee) } : {},
        type ? { type: { equals: type } } : {},
        serie ? { serie: { equals: serie } } : {},
        q
          ? {
              OR: [
                { titre: { contains: q } },
                { description: { contains: q } },
                { matiere: { contains: q } },
              ],
            }
          : {},
      ],
    };

    const skip = (Number(page) - 1) * Number(taille);

    const [items, total] = await Promise.all([
      prisma.epreuve.findMany({
        where: ou,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(taille),
        include: { auteur: AUTEUR_SELECT },
      }),
      prisma.epreuve.count({ where: ou }),
    ]);

    res.json({ items, total, page: Number(page), taille: Number(taille) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible de charger les épreuves." });
  }
});

// GET /api/epreuves/filtres - valeurs distinctes pour construire les filtres du frontend
router.get("/filtres", async (_req, res) => {
  try {
    const [matieres, niveaux, annees] = await Promise.all([
      prisma.epreuve.findMany({ distinct: ["matiere"], select: { matiere: true } }),
      prisma.epreuve.findMany({ distinct: ["niveau"], select: { niveau: true } }),
      prisma.epreuve.findMany({ distinct: ["annee"], select: { annee: true }, orderBy: { annee: "desc" } }),
    ]);
    res.json({
      matieres: matieres.map((m) => m.matiere),
      niveaux: niveaux.map((n) => n.niveau),
      annees: annees.map((a) => a.annee),
      types: ["DEVOIR", "COMPOSITION", "BEPC", "BAC", "CONCOURS", "EXAMEN_BLANC"],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible de charger les filtres." });
  }
});

// GET /api/epreuves/:id
router.get("/:id", async (req, res) => {
  const epreuve = await prisma.epreuve.findUnique({
    where: { id: req.params.id },
    include: { auteur: AUTEUR_SELECT },
  });
  if (!epreuve) return res.status(404).json({ erreur: "Épreuve introuvable." });
  res.json({ epreuve });
});

// POST /api/epreuves - ajouter une épreuve (utilisateur connecté)
router.post("/", requireAuth, upload.single("fichier"), async (req, res) => {
  try {
    const { titre, matiere, niveau, serie, annee, type, region, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ erreur: "Le fichier de l'épreuve est obligatoire." });
    }
    if (!titre || !matiere || !niveau || !annee || !type) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ erreur: "Titre, matière, niveau, année et type sont obligatoires." });
    }

    const epreuve = await prisma.epreuve.create({
      data: {
        titre,
        matiere,
        niveau,
        serie: serie || null,
        annee: Number(annee),
        type,
        region: region || null,
        description: description || null,
        cheminFichier: req.file.filename,
        nomFichierOrig: req.file.originalname,
        auteurId: req.user.id,
      },
      include: { auteur: AUTEUR_SELECT },
    });

    res.status(201).json({ epreuve });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible d'ajouter l'épreuve." });
  }
});

// GET /api/epreuves/:id/telecharger
router.get("/:id/telecharger", async (req, res) => {
  const epreuve = await prisma.epreuve.findUnique({ where: { id: req.params.id } });
  if (!epreuve) return res.status(404).json({ erreur: "Épreuve introuvable." });

  const chemin = path.join(__dirname, "..", "..", "uploads", epreuve.cheminFichier);
  if (!fs.existsSync(chemin)) return res.status(404).json({ erreur: "Fichier introuvable sur le serveur." });

  await prisma.epreuve.update({ where: { id: epreuve.id }, data: { telechargements: { increment: 1 } } });
  res.download(chemin, epreuve.nomFichierOrig);
});

// DELETE /api/epreuves/:id - auteur ou admin uniquement
router.delete("/:id", requireAuth, async (req, res) => {
  const epreuve = await prisma.epreuve.findUnique({ where: { id: req.params.id } });
  if (!epreuve) return res.status(404).json({ erreur: "Épreuve introuvable." });

  if (epreuve.auteurId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ erreur: "Vous ne pouvez supprimer que vos propres publications." });
  }

  const chemin = path.join(__dirname, "..", "..", "uploads", epreuve.cheminFichier);
  fs.unlink(chemin, () => {});
  await prisma.epreuve.delete({ where: { id: epreuve.id } });
  res.json({ succes: true });
});

module.exports = router;
