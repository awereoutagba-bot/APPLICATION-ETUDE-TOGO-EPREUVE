# Etude Togo

Plateforme éducative togolaise : épreuves (BEPC, BAC, devoirs...), documents (cours, fiches, corrigés),
espaces de travail pour élèves et enseignants, et un **guide de l'Approche Par Compétences (APC)**
pour accompagner les enseignants.

Projet complet en deux parties :
- `backend/` — API Node.js + Express + Prisma (base SQLite en dev, PostgreSQL en prod) + authentification JWT
- `frontend/` — application React (Vite) + Tailwind CSS v4

---

## 1. Démarrage en local

### Prérequis
- Node.js 18 ou plus récent
- npm

### 1.1 Backend

```bash
cd backend
cp .env.example .env        # ajuster JWT_SECRET si besoin
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed                 # crée les comptes de démo + les 5 modules du guide APC
npm run dev                  # démarre l'API sur http://localhost:4000
```

Comptes de démonstration créés par `npm run seed` (mot de passe : `motdepasse123`) :
- `admin@etudetogo.tg`
- `enseignant@etudetogo.tg`
- `eleve@etudetogo.tg`

### 1.2 Frontend

Dans un second terminal :

```bash
cd frontend
cp .env.example .env         # VITE_API_URL doit pointer vers l'API (http://localhost:4000 par défaut)
npm install
npm run dev                  # démarre l'app sur http://localhost:5173
```

Ouvrez `http://localhost:5173`.

---

## 2. Structure du projet

```
etude-togo/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # modèles : User, Epreuve, Document, Favori, ModuleAPC, ProgressionAPC
│   │   └── seed.js             # comptes démo + 5 modules APC rédigés
│   ├── src/
│   │   ├── routes/              # auth, epreuves, documents, apc-guide, users
│   │   ├── middleware/          # auth (JWT + rôles), upload (multer)
│   │   ├── prisma.js
│   │   └── server.js
│   └── uploads/                 # fichiers déposés (PDF, DOCX, images)
└── frontend/
    └── src/
        ├── pages/                # Accueil, Epreuves, Documents, Ajouter, EspaceEleve,
        │                         # EspaceEnseignant, GuideAPC, Connexion, Inscription...
        ├── components/           # Navbar, Footer, EpreuveCard, Tampon, RouteProtegee
        ├── context/AuthContext.jsx
        └── api/client.js
```

## 3. Fonctionnalités couvertes

- **Épreuves** : dépôt (upload PDF/DOCX/image), recherche et filtres (matière, niveau, année, type),
  téléchargement avec compteur, suppression par l'auteur ou un admin.
- **Documents** : mêmes fonctions que les épreuves, avec des catégories (cours, fiche résumé, corrigé, programme).
- **Comptes** : inscription/connexion, rôles Élève / Enseignant / Admin, JWT.
- **Espace élève** : favoris, suggestions d'épreuves filtrées sur le niveau du compte.
- **Espace enseignant** : suivi de ses publications, barre de progression sur le guide APC.
- **Guide APC** : 5 modules rédigés (comprendre l'APC, la situation-problème, planifier une séquence,
  évaluer par compétences, gérer les classes à gros effectif), suivi de progression par utilisateur.

## 4. Passer en production

### Base de données
Le projet utilise SQLite par défaut (fichier `dev.db`), pratique pour démarrer sans rien installer.
Pour la production, remplacez dans `backend/prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

puis pointez `DATABASE_URL` vers une base PostgreSQL managée (Railway, Render, Supabase, Neon...) et relancez :

```bash
npx prisma migrate deploy
```

### Fichiers déposés (épreuves/documents)
En développement, les fichiers sont stockés sur le disque du serveur (`backend/uploads/`) et servis via
`/fichiers/...`. En production, sur des hébergeurs à système de fichiers éphémère (Render, Railway, Heroku),
préférez un stockage objet (S3, Cloudinary, Backblaze B2) pour ne pas perdre les fichiers à chaque redéploiement.

### Déploiement suggéré
- **Backend** : Railway, Render ou Fly.io (Node.js + PostgreSQL managé inclus).
- **Frontend** : Vercel ou Netlify (`npm run build`, dossier `dist/`), avec `VITE_API_URL` pointant vers l'API déployée.
- Ajoutez un nom de domaine et activez HTTPS sur les deux services.
- Changez impérativement `JWT_SECRET` en production (chaîne longue et aléatoire).

### Docker (optionnel)
Le projet ne fournit pas encore de `Dockerfile` ; chaque dossier (`backend/`, `frontend`) peut être conteneurisé
séparément si vous préférez un déploiement Docker/Docker Compose plutôt que des PaaS.

## 5. Prochaines étapes possibles

- Panneau d'administration (modération des dépôts, gestion des modules APC depuis l'interface).
- Notation/commentaires sur les épreuves et documents.
- Export PDF du guide APC pour une lecture hors-ligne.
- Statistiques par établissement pour les enseignants.
