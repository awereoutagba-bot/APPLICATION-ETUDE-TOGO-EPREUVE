# Frontend - Etude Togo

Application React + Vite pour la plateforme Etude Togo.

## Structure

```
frontend/
├── public/              # fichiers statiques
├── src/
│   ├── api/             # client Axios et utilitaires API
│   ├── components/      # composants réutilisables
│   ├── context/         # contexte d'authentification
│   ├── pages/           # pages de l'application
│   ├── App.jsx          # configuration des routes
│   ├── main.jsx         # point d'entrée React
│   ├── index.css        # styles globaux
│   └── constants.js     # constantes partagées
├── .env.example         # configuration d'environnement Vite
├── package.json
└── vite.config.js
```

## Installation

```bash
cd frontend
npm install
npm run dev
```

## Variables d'environnement

Copiez `.env.example` en `.env` puis adaptez :

- `VITE_API_URL` : URL de l'API backend

## Bonnes pratiques d’organisation

- Garder `src/components/` pour les petits composants réutilisables.
- Mettre les pages complètes dans `src/pages/`.
- Centraliser les appels API dans `src/api/client.js`.
- Conserver la logique d'authentification dans `src/context/AuthContext.jsx`.
- Ajouter `src/hooks/` si vous créez plusieurs hooks personnalisés.
- Ajouter `src/utils/` si vous avez des fonctions utilitaires partagées.
- Préférer des composants simples, et extraire la logique métier en hooks ou services.

## Suggestions de refactorisation

- Déplacer les constantes partagées vers `src/constants/` ou `src/utils/` si elles grossissent.
- Créer `src/services/` pour les appels API spécifiques (epreuves, documents, users).
- Créer `src/hooks/` pour `useSearch`, `useForm`, `usePagination`, etc.
