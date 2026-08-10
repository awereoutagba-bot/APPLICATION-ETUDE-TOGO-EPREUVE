const express = require("express");
const prisma = require("../prisma");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET /api/apc-guide - liste des modules, ordonnés
router.get("/", async (req, res) => {
  const modules = await prisma.moduleAPC.findMany({ orderBy: { ordre: "asc" } });
  res.json({ modules });
});

// GET /api/apc-guide/progression - progression de l'enseignant connecté
router.get("/progression", requireAuth, async (req, res) => {
  const progressions = await prisma.progressionAPC.findMany({
    where: { userId: req.user.id },
  });
  res.json({ progressions });
});

// GET /api/apc-guide/:id
router.get("/:id", async (req, res) => {
  const module = await prisma.moduleAPC.findUnique({ where: { id: req.params.id } });
  if (!module) return res.status(404).json({ erreur: "Module introuvable." });
  res.json({ module });
});

// POST /api/apc-guide/:id/terminer - marquer un module comme terminé
router.post("/:id/terminer", requireAuth, async (req, res) => {
  const module = await prisma.moduleAPC.findUnique({ where: { id: req.params.id } });
  if (!module) return res.status(404).json({ erreur: "Module introuvable." });

  const progression = await prisma.progressionAPC.upsert({
    where: { userId_moduleId: { userId: req.user.id, moduleId: module.id } },
    update: { termine: true },
    create: { userId: req.user.id, moduleId: module.id, termine: true },
  });

  res.json({ progression });
});

// POST /api/apc-guide - créer un module (admin uniquement)
router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { ordre, titre, resume, contenu, dureeMin } = req.body;
  if (!ordre || !titre || !resume || !contenu) {
    return res.status(400).json({ erreur: "Ordre, titre, résumé et contenu sont obligatoires." });
  }
  const module = await prisma.moduleAPC.create({
    data: { ordre, titre, resume, contenu, dureeMin: dureeMin || 15 },
  });
  res.status(201).json({ module });
});

module.exports = router;
