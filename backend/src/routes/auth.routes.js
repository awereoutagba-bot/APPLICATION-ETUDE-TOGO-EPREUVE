const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const { signToken } = require("../utils/jwt");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

function utilisateurPublic(user) {
  const { motDePasse, ...reste } = user;
  return reste;
}

// POST /api/auth/inscription
router.post("/inscription", async (req, res) => {
  try {
    const { email, motDePasse, nom, prenom, role, niveau, matiere, etablissement } = req.body;

    if (!email || !motDePasse || !nom || !prenom) {
      return res.status(400).json({ erreur: "Nom, prénom, email et mot de passe sont obligatoires." });
    }
    if (motDePasse.length < 6) {
      return res.status(400).json({ erreur: "Le mot de passe doit contenir au moins 6 caractères." });
    }
    if (role && !["ELEVE", "ENSEIGNANT"].includes(role)) {
      return res.status(400).json({ erreur: "Profil invalide." });
    }

    const existant = await prisma.user.findUnique({ where: { email } });
    if (existant) {
      return res.status(409).json({ erreur: "Un compte existe déjà avec cet email." });
    }

    const hash = await bcrypt.hash(motDePasse, 10);
    const user = await prisma.user.create({
      data: {
        email,
        motDePasse: hash,
        nom,
        prenom,
        role: role || "ELEVE",
        niveau: niveau || null,
        matiere: matiere || null,
        etablissement: etablissement || null,
      },
    });

    const token = signToken(user);
    res.status(201).json({ token, user: utilisateurPublic(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Impossible de créer le compte pour le moment." });
  }
});

// POST /api/auth/connexion
router.post("/connexion", async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
      return res.status(400).json({ erreur: "Email et mot de passe requis." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      return res.status(401).json({ erreur: "Email ou mot de passe incorrect." });
    }

    const token = signToken(user);
    res.json({ token, user: utilisateurPublic(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Connexion impossible pour le moment." });
  }
});

// GET /api/auth/moi
router.get("/moi", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ erreur: "Utilisateur introuvable." });
  res.json({ user: utilisateurPublic(user) });
});

module.exports = router;
