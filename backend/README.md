# Backend - Etude Togo

API Node.js + Express + Prisma pour la plateforme Etude Togo.

## Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── middleware/      # auth, upload, validation
│   ├── routes/          # routes API REST
│   ├── utils/           # helpers réutilisables (JWT, config...)
│   ├── prisma.js        # instance Prisma partagée
│   └── server.js        # point d'entrée Express
├── uploads/             # fichiers déposés en dev
├── .env.example         # variables d'environnement
└── package.json
```

## Installation

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

## Variables d'environnement

Copiez `.env.example` en `.env` puis adaptez :

- `DATABASE_URL` : URL SQLite en local ou PostgreSQL en production
- `JWT_SECRET` : secret JWT à changer en production
- `FRONTEND_URL` : origine autorisée pour le frontend
- `MAX_FILE_SIZE` : taille max des fichiers uploadés

## Scripts utiles

- `npm run dev` : lance le serveur avec `nodemon`
- `npm start` : démarre le serveur Node
- `npm run seed` : crée les comptes de démonstration
- `npm run prisma:generate` : génère le client Prisma
- `npm run prisma:migrate` : applique les migrations en local
- `npm run prisma:deploy` : déploie les migrations en production

## Bonnes pratiques d’organisation

- Séparer la logique métier dans `src/routes` et `src/utils`.
- Ajouter un dossier `src/controllers` si les routes deviennent volumineuses.
- Éviter de versionner `uploads/` et `dev.db`.
- Préférer un stockage objet (S3, Cloudinary) en production.
