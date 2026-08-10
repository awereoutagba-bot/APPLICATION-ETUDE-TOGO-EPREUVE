const express = require("express");
const path = require("path");
const fs = require("fs");
const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

const AUTEUR_SELECT = {
  select: { id: true, nom: true, prenom: true, role: true, etablissement: true },
};

// GET /api/documents - liste avec filtres et recherche
router.get("/", async (req, res) => {
  try {
    const { matiere, niveau, categorie, q, page = 1, taille = 20 } = req.query;

    const ou = {
      AND: [
        matiere ? { matiere: { equals: matiere } } : {},
        niveau ? { niveau: { equals: niveau } } : {},
        categorie ? { categorie: { equals: categorie } } : {},
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
      prisma.document.findMany({
        where: ou,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(taille),
        include: { auteur: AUTEUR_SELECT },
      }),
      prisma.document.count({ where: ou }),
    ]);

    res.json({ items, total, page: Number(page), taille: Number(taille) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible de charger les documents." });
  }
});

// GET /api/documents/:id
router.get("/:id", async (req, res) => {
  const document = await prisma.document.findUnique({
    where: { id: req.params.id },
    include: { auteur: AUTEUR_SELECT },
  });
  if (!document) return res.status(404).json({ erreur: "Document introuvable." });
  res.json({ document });
});

// POST /api/documents - ajouter un document (utilisateur connecté)
router.post("/", requireAuth, upload.single("fichier"), async (req, res) => {
  try {
    const { titre, matiere, niveau, categorie, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ erreur: "Le fichier du document est obligatoire." });
    }
    if (!titre || !matiere || !niveau || !categorie) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ erreur: "Titre, matière, niveau et catégorie sont obligatoires." });
    }

    const document = await prisma.document.create({
      data: {
        titre,
        matiere,
        niveau,
        categorie,
        description: description || null,
        cheminFichier: req.file.filename,
        nomFichierOrig: req.file.originalname,
        auteurId: req.user.id,
      },
      include: { auteur: AUTEUR_SELECT },
    });

    res.status(201).json({ document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible d'ajouter le document." });
  }
});

// GET /api/documents/:id/telecharger
router.get("/:id/telecharger", async (req, res) => {
  const document = await prisma.document.findUnique({ where: { id: req.params.id } });
  if (!document) return res.status(404).json({ erreur: "Document introuvable." });

  const chemin = path.join(__dirname, "..", "..", "uploads", document.cheminFichier);
  if (!fs.existsSync(chemin)) return res.status(404).json({ erreur: "Fichier introuvable sur le serveur." });

  await prisma.document.update({ where: { id: document.id }, data: { telechargements: { increment: 1 } } });
  res.download(chemin, document.nomFichierOrig);
});

// DELETE /api/documents/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const document = await prisma.document.findUnique({ where: { id: req.params.id } });
  if (!document) return res.status(404).json({ erreur: "Document introuvable." });

  if (document.auteurId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ erreur: "Vous ne pouvez supprimer que vos propres publications." });
  }

  const chemin = path.join(__dirname, "..", "..", "uploads", document.cheminFichier);
  fs.unlink(chemin, () => {});
  await prisma.document.delete({ where: { id: document.id } });
  res.json({ succes: true });
});

module.exports = router;
