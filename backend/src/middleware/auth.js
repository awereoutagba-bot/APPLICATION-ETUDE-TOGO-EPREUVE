const { verifyToken } = require("../utils/jwt");

/**
 * Vérifie qu'un token JWT valide est présent.
 * Ajoute req.user = { id, role, email } si valide.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erreur: "Connexion requise." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (err) {
    return res.status(401).json({ erreur: "Session invalide ou expirée, reconnectez-vous." });
  }
}

/**
 * Vérifie l'authentification si un token est fourni, sans bloquer sinon.
 * Utile pour des routes publiques qui personnalisent la réponse si connecté.
 */
function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch (err) {
      req.user = null;
    }
  }
  next();
}

/**
 * Restreint l'accès à une liste de rôles.
 * Exemple : requireRole("ENSEIGNANT", "ADMIN")
 */
function requireRole(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erreur: "Connexion requise." });
    }
    if (!rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({ erreur: "Accès réservé à un autre profil." });
    }
    next();
  };
}

module.exports = { requireAuth, optionalAuth, requireRole };
