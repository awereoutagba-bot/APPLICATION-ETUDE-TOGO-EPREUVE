-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ELEVE',
    "niveau" TEXT,
    "matiere" TEXT,
    "etablissement" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Epreuve" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "serie" TEXT,
    "annee" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "region" TEXT,
    "description" TEXT,
    "cheminFichier" TEXT NOT NULL,
    "nomFichierOrig" TEXT NOT NULL,
    "telechargements" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auteurId" TEXT NOT NULL,
    CONSTRAINT "Epreuve_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "description" TEXT,
    "cheminFichier" TEXT NOT NULL,
    "nomFichierOrig" TEXT NOT NULL,
    "telechargements" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auteurId" TEXT NOT NULL,
    CONSTRAINT "Document_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favori" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "epreuveId" TEXT,
    "documentId" TEXT,
    CONSTRAINT "Favori_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favori_epreuveId_fkey" FOREIGN KEY ("epreuveId") REFERENCES "Epreuve" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Favori_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModuleAPC" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ordre" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "dureeMin" INTEGER NOT NULL DEFAULT 15,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProgressionAPC" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "termine" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    CONSTRAINT "ProgressionAPC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProgressionAPC_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleAPC" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Favori_userId_epreuveId_documentId_key" ON "Favori"("userId", "epreuveId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAPC_ordre_key" ON "ModuleAPC"("ordre");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressionAPC_userId_moduleId_key" ON "ProgressionAPC"("userId", "moduleId");
