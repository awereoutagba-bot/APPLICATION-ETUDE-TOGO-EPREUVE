const express = require("express");
const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/users/moi/publications - épreuves + documents publiés par l'utilisateur connecté
router.get("/moi/publications", requireAuth, async (req, res) => {
  const [epreuves, documents] = await Promise.all([
    prisma.epreuve.findMany({ where: { auteurId: req.user.id }, orderBy: { createdAt: "desc" } }),
    prisma.document.findMany({ where: { auteurId: req.user.id }, orderBy: { createdAt: "desc" } }),
  ]);
  res.json({ epreuves, documents });
});

// GET /api/users/moi/favoris
router.get("/moi/favoris", requireAuth, async (req, res) => {
  const favoris = await prisma.favori.findMany({
    where: { userId: req.user.id },
    include: { epreuve: true, document: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ favoris });
});

// POST /api/users/moi/favoris - ajouter un favori { epreuveId } ou { documentId }
router.post("/moi/favoris", requireAuth, async (req, res) => {
  const { epreuveId, documentId } = req.body;
  if (!epreuveId && !documentId) {
    return res.status(400).json({ erreur: "Indiquez une épreuve ou un document à ajouter aux favoris." });
  }
  try {
    const favori = await prisma.favori.create({
      data: { userId: req.user.id, epreuveId: epreuveId || null, documentId: documentId || null },
    });
    res.status(201).json({ favori });
  } catch (err) {
    res.status(409).json({ erreur: "Ce contenu est déjà dans vos favoris." });
  }
});

// DELETE /api/users/moi/favoris/:id
router.delete("/moi/favoris/:id", requireAuth, async (req, res) => {
  const favori = await prisma.favori.findUnique({ where: { id: req.params.id } });
  if (!favori || favori.userId !== req.user.id) {
    return res.status(404).json({ erreur: "Favori introuvable." });
  }
  await prisma.favori.delete({ where: { id: req.params.id } });
  res.json({ succes: true });
});

module.exports = router;
