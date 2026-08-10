import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import EpreuveCard from "../components/EpreuveCard";
import Tampon from "../components/Tampon";

export default function Accueil() {
  const [recentes, setRecentes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    api
      .get("/epreuves", { params: { taille: 6 } })
      .then((res) => setRecentes(res.data.items))
      .catch(() => setRecentes([]))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] md:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-sm shadow-black/5 backdrop-blur-sm">
              <div className="flag-badge">TG</div>
              <span className="text-sm uppercase tracking-[0.3em] text-[var(--color-tableau)]/80">Togo — plateforme éducative</span>
            </div>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold leading-[1.03] text-[var(--color-tableau)] sm:text-5xl">
                Un espace moderne pour les <span className="text-[var(--color-rouge-encre)]">élèves</span> et les <span className="text-[var(--color-tableau-clair)]">enseignants</span> du Togo.
              </h1>
              <p className="max-w-xl text-lg text-[var(--color-encre)]/80">
                Épreuves BEPC & BAC, devoirs, fiches, corrigés et un guide APC clair. Tout est organisé pour que ta recherche soit rapide et agréable.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 rounded-[32px] border border-[rgba(34,57,46,0.08)] bg-white/90 p-4 shadow-xl shadow-black/5 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/epreuves?q=${encodeURIComponent(recherche)}`;
              }}
            >
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher une matière, un niveau, une année..."
                className="champ flex-1"
              />
              <button
                type="submit"
                className="rounded-3xl bg-[var(--color-rouge-encre)] px-6 py-3 text-sm font-semibold text-[var(--color-craie)] transition hover:bg-[var(--color-rouge-encre-clair)]"
              >
                Rechercher
              </button>
            </form>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to="/ajouter"
                className="rounded-3xl border border-[rgba(34,57,46,0.12)] bg-white/90 px-5 py-4 text-sm font-semibold text-[var(--color-tableau)] shadow-sm shadow-black/5 transition hover:-translate-y-0.5"
              >
                Déposer une épreuve ou un document
              </Link>
              <Link
                to="/guide-apc"
                className="rounded-3xl border border-[rgba(34,57,46,0.12)] bg-white/90 px-5 py-4 text-sm font-semibold text-[var(--color-tableau)] shadow-sm shadow-black/5 transition hover:-translate-y-0.5"
              >
                Découvrir le guide APC
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block" aria-hidden="true">
            <div className="fiche absolute right-6 top-2 w-64 -rotate-3 p-5">
              <span className="tampon tampon--rouge">BAC 2024</span>
              <p className="mt-3 font-display text-sm font-semibold">Mathématiques — Série D</p>
              <p className="mt-1 text-xs text-[var(--color-encre)]/60">Déposé par A. Kokou</p>
            </div>
            <div className="fiche absolute right-24 top-40 w-64 rotate-2 p-5">
              <span className="tampon tampon--vert">Devoir</span>
              <p className="mt-3 font-display text-sm font-semibold">Physique-Chimie — 3e</p>
              <p className="mt-1 text-xs text-[var(--color-encre)]/60">142 téléchargements</p>
            </div>
            <div className="fiche absolute right-2 top-72 w-56 -rotate-1 p-5">
              <span className="tampon tampon--ocre">Guide APC</span>
              <p className="mt-3 font-display text-sm font-semibold">Module 2 — Situation-problème</p>
            </div>
          </div>
        </div>
      </section>

      {/* Publics */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="fiche p-6">
            <span className="tampon tampon--rouge">Élèves</span>
            <h2 className="mt-4 font-display text-xl font-bold">Réviser avec les vraies épreuves</h2>
            <p className="mt-2 text-sm text-[var(--color-encre)]/75">
              Retrouve les épreuves de ton niveau, filtre par matière et par année, et entraîne-toi avec les
              sujets déjà tombés au BEPC et au BAC.
            </p>
            <Link to="/espace-eleve" className="mt-4 inline-block text-sm font-semibold text-[var(--color-tableau)] hover:underline">
              Mon espace élève →
            </Link>
          </div>
          <div className="fiche p-6">
            <span className="tampon tampon--vert">Enseignants</span>
            <h2 className="mt-4 font-display text-xl font-bold">Partager et se former</h2>
            <p className="mt-2 text-sm text-[var(--color-encre)]/75">
              Publie tes devoirs et corrigés, et suis le guide APC pour construire des situations-problèmes et
              évaluer par compétences.
            </p>
            <Link to="/espace-enseignant" className="mt-4 inline-block text-sm font-semibold text-[var(--color-tableau)] hover:underline">
              Mon espace enseignant →
            </Link>
          </div>
          <div className="fiche p-6">
            <span className="tampon tampon--ocre">Tout le monde</span>
            <h2 className="mt-4 font-display text-xl font-bold">Contribuer en un dépôt</h2>
            <p className="mt-2 text-sm text-[var(--color-encre)]/75">
              Un formulaire simple pour ajouter une épreuve ou un document : titre, matière, niveau, année, et le
              fichier. C'est tout.
            </p>
            <Link to="/ajouter" className="mt-4 inline-block text-sm font-semibold text-[var(--color-tableau)] hover:underline">
              Ajouter une ressource →
            </Link>
          </div>
        </div>
      </section>

      {/* Épreuves récentes */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-[var(--color-tableau)]">Dernières épreuves déposées</h2>
          <Link to="/epreuves" className="text-sm font-semibold text-[var(--color-rouge-encre)] hover:underline">
            Voir tout
          </Link>
        </div>
        {chargement ? (
          <p className="text-sm text-[var(--color-encre)]/60">Chargement des épreuves…</p>
        ) : recentes.length === 0 ? (
          <div className="fiche p-8 text-center">
            <p className="font-display text-lg font-semibold">Aucune épreuve pour l'instant</p>
            <p className="mt-2 text-sm text-[var(--color-encre)]/70">
              Soyez le premier à enrichir la bibliothèque commune.
            </p>
            <Link to="/ajouter" className="mt-4 inline-block rounded-sm bg-[var(--color-tableau)] px-5 py-2.5 text-sm font-semibold text-[var(--color-craie)]">
              Déposer une épreuve
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentes.map((ep) => (
              <EpreuveCard key={ep.id} epreuve={ep} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
