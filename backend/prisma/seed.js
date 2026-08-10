const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const MODULES_APC = [
  {
    ordre: 1,
    titre: "Comprendre l'Approche Par Compétences (APC)",
    resume:
      "Les principes de base de l'APC et ce qui change par rapport à la pédagogie par objectifs (PPO).",
    dureeMin: 12,
    contenu: `## Qu'est-ce que l'APC ?

L'Approche Par Compétences est le référentiel pédagogique en vigueur dans le système éducatif togolais depuis les réformes des programmes scolaires. Elle place l'élève au centre de son apprentissage : au lieu de mémoriser des savoirs isolés, l'élève apprend à **mobiliser des ressources (connaissances, savoir-faire, savoir-être) pour résoudre une situation concrète**.

## PPO vs APC : ce qui change

- **Pédagogie par objectifs (PPO)** : l'enseignant découpe la matière en objectifs précis, l'élève restitue des connaissances.
- **APC** : l'élève est confronté à une **situation-problème** proche du réel, et doit combiner plusieurs savoirs pour la résoudre.

## Les trois piliers de l'APC

1. **La compétence** : capacité à agir efficacement dans une famille de situations, en mobilisant des ressources.
2. **La situation d'intégration** : un contexte concret qui donne du sens aux apprentissages.
3. **L'évaluation par compétences** : on évalue la capacité à *faire*, pas seulement à *savoir*.

## Pourquoi ce changement ?

L'APC vise à former des élèves capables de réinvestir leurs acquis scolaires dans la vie courante et professionnelle, plutôt que des élèves qui savent réciter sans savoir appliquer.`,
  },
  {
    ordre: 2,
    titre: "La situation-problème : cœur de la démarche APC",
    resume: "Comment construire et exploiter une situation-problème en classe.",
    dureeMin: 15,
    contenu: `## Définir la situation-problème

Une situation-problème est un scénario réaliste, proche du vécu de l'élève, qui exige la mobilisation de plusieurs ressources (d'une ou plusieurs disciplines) pour être résolu. Elle n'a pas de solution évidente ou immédiate : elle crée un obstacle cognitif que l'élève doit surmonter.

## Les critères d'une bonne situation-problème

- **Contextualisée** : ancrée dans le vécu togolais (marché, champ, famille, quartier...).
- **Complexe mais accessible** : elle mobilise plusieurs ressources, sans être hors de portée du niveau de la classe.
- **Porteuse de sens** : l'élève comprend pourquoi il doit la résoudre.
- **Ouverte** : elle admet une démarche de résolution, pas une réponse à cocher.

## Exemple simple (niveau primaire, mathématiques)

*"Le marché de ton village se tient tous les 5 jours. Ta mère y vend des ignames à 500 FCFA le tas. Elle veut savoir combien elle gagnera si elle vend 24 tas. Calcule ce montant et propose-lui une façon simple de vérifier son compte."*

Cette situation mobilise : la multiplication, la vérification par une autre opération, et un ancrage social direct.

## Les 3 temps de la démarche

1. **Présentation** de la situation et appropriation par les élèves (lecture, reformulation).
2. **Résolution** en groupes ou individuellement, avec l'enseignant en accompagnateur.
3. **Mise en commun et institutionnalisation** : validation collective des démarches, structuration du savoir.`,
  },
  {
    ordre: 3,
    titre: "Planifier une séquence APC",
    resume: "La structure type d'une séquence pédagogique selon l'APC.",
    dureeMin: 18,
    contenu: `## Structure d'une séquence APC

Une séquence APC se déroule généralement en 3 phases :

### 1. Phase de développement (apprentissages ponctuels)

L'enseignant introduit les ressources nécessaires (connaissances, techniques, vocabulaire) à travers des activités courtes et ciblées. C'est ici que l'on pose les briques du savoir.

### 2. Phase d'intégration

L'élève est mis face à une situation-problème qui l'oblige à combiner les ressources apprises. Cette phase peut s'étaler sur une ou plusieurs séances, selon la complexité de la situation.

### 3. Phase d'évaluation

On évalue la capacité de l'élève à mobiliser ses ressources dans une situation nouvelle, similaire mais non identique à celle travaillée en classe. On corrige avec une grille de critères (pas seulement un barème de bonnes réponses).

## Conseils pratiques pour la classe togolaise

- Travailler en petits groupes hétérogènes facilite la phase d'intégration, surtout dans les classes à effectif élevé.
- Réutiliser des supports locaux (marché, agriculture, artisanat, transport) rend les situations plus parlantes.
- Ne pas hésiter à réduire la complexité de la situation si les ressources de base ne sont pas encore stabilisées chez la majorité des élèves.`,
  },
  {
    ordre: 4,
    titre: "Évaluer par compétences",
    resume: "Construire une grille de correction critériée, adaptée à l'APC.",
    dureeMin: 15,
    contenu: `## Pourquoi une grille critériée ?

En APC, on ne corrige pas seulement le résultat final : on évalue le **processus de résolution**. Une grille critériée permet de repérer précisément où se situe la difficulté de l'élève.

## Les critères courants

- **Critère de pertinence** : l'élève a-t-il choisi les bonnes ressources pour la situation posée ?
- **Critère d'utilisation correcte des outils** : les techniques et savoirs mobilisés sont-ils appliqués sans erreur ?
- **Critère de cohérence** : la démarche est-elle logique de bout en bout ?
- **Critère de perfectionnement (facultatif)** : présentation, originalité, qualité de la justification.

## Exemple de barème critérié

| Critère | Points | Ce qu'on vérifie |
|---|---|---|
| Pertinence | 6 pts | L'élève identifie les bonnes données et la bonne opération |
| Application correcte | 8 pts | Calculs/techniques exécutés sans erreur |
| Cohérence | 4 pts | Les étapes s'enchaînent logiquement |
| Présentation | 2 pts | Clarté de la copie, unités indiquées |

## Erreur fréquente à éviter

Ne pas réduire l'évaluation APC à une simple addition de connaissances récitées : toujours vérifier que l'élève sait **pourquoi** et **comment** il mobilise chaque ressource, pas seulement **qu'il la connaît**.`,
  },
  {
    ordre: 5,
    titre: "Différencier la pédagogie en classe à gros effectif",
    resume: "Adapter l'APC aux réalités des classes togolaises surchargées.",
    dureeMin: 10,
    contenu: `## Le défi du grand effectif

De nombreuses classes au Togo comptent 60 élèves ou plus. L'APC, qui suppose un accompagnement individualisé, doit être adaptée sans être dénaturée.

## Stratégies pratiques

1. **Groupes de 5 à 6 élèves** avec un rapporteur désigné à tour de rôle : cela multiplie les interactions sans multiplier la charge de correction immédiate.
2. **Tutorat entre pairs** : les élèves plus avancés accompagnent un petit groupe, sous la supervision de l'enseignant qui circule.
3. **Situations d'intégration mutualisées** : une même situation peut être découpée en sous-tâches réparties entre groupes, puis mises en commun.
4. **Évaluation par sondage** : lors des évaluations formatives, corriger en profondeur un échantillon représentatif de copies plutôt que la totalité à chaque fois, sans que cela remplace l'évaluation sommative complète.

## Ce qu'il ne faut pas sacrifier

Même avec un grand effectif, la phase de mise en commun collective reste essentielle : c'est elle qui permet d'institutionnaliser le savoir pour tous, y compris ceux qui n'ont pas résolu la situation seuls.`,
  },
];

async function main() {
  console.log("🌱 Démarrage du seed...");

  const motDePasseHash = await bcrypt.hash("motdepasse123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@etudetogo.tg" },
    update: {},
    create: {
      email: "admin@etudetogo.tg",
      motDePasse: motDePasseHash,
      nom: "Admin",
      prenom: "Etude Togo",
      role: "ADMIN",
    },
  });

  const enseignant = await prisma.user.upsert({
    where: { email: "enseignant@etudetogo.tg" },
    update: {},
    create: {
      email: "enseignant@etudetogo.tg",
      motDePasse: motDePasseHash,
      nom: "Kokou",
      prenom: "Adjovi",
      role: "ENSEIGNANT",
      matiere: "Mathématiques",
      etablissement: "Lycée de Tokoin",
    },
  });

  const eleve = await prisma.user.upsert({
    where: { email: "eleve@etudetogo.tg" },
    update: {},
    create: {
      email: "eleve@etudetogo.tg",
      motDePasse: motDePasseHash,
      nom: "Mensah",
      prenom: "Ama",
      role: "ELEVE",
      niveau: "Tle D",
      etablissement: "Lycée de Bè",
    },
  });

  for (const m of MODULES_APC) {
    await prisma.moduleAPC.upsert({
      where: { ordre: m.ordre },
      update: m,
      create: m,
    });
  }

  console.log("✅ Comptes de démonstration :");
  console.log("   admin@etudetogo.tg / motdepasse123");
  console.log("   enseignant@etudetogo.tg / motdepasse123");
  console.log("   eleve@etudetogo.tg / motdepasse123");
  console.log(`✅ ${MODULES_APC.length} modules APC insérés.`);
  console.log("ℹ️  Aucune épreuve/document de démo n'a été créé : ajoutez-les via l'interface (upload de fichier requis).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
