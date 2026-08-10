import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Tampon from "../components/Tampon";
import { LIBELLES_TYPE, LIBELLES_CATEGORIE } from "../constants";

export default function EspaceEnseignant() {
  const { user } = useAuth();
  const [publications, setPublications] = useState({ epreuves: [], documents: [] });
  const [modules, setModules] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/users/moi/publications"),
      api.get("/apc-guide"),
      api.get("/apc-guide/progression"),
    ])
      .then(([pubRes, modRes, progRes]) => {
        setPublications(pubRes.data);
        setModules(modRes.data.modules);
        setProgressions(progRes.data.progressions);
      })
      .finally(() => setChargement(false));
  }, []);

  const modulesTermines = progressions.filter((p) => p.termine).length;
  const totalModules = modules.length;
  const progressionPct = totalModules ? Math.round((modulesTermines / totalModules) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="tampon tampon--vert">Espace enseignant</span>
      <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-tableau)]">
        Bienvenue, {user?.prenom}
      </h1>
      <p className="mt-1 text-sm text-[var(--color-encre)]/70">
        {user?.matiere ? `${user.matiere}` : ""}{user?.etablissement ? ` · ${user.etablissement}` : ""}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/ajouter" className="rounded-sm bg-[var(--color-tableau)] px-5 py-2.5 text-sm font-semibold text-[var(--color-craie)]">
          Publier une épreuve/document
        </Link>
        <Link to="/guide-apc" className="rounded-sm border-2 border-[var(--color-tableau)] px-5 py-2.5 text-sm font-semibold text-[var(--color-tableau)]">
          Ouvrir le guide APC
        </Link>
      </div>

      {/* Progression APC */}
      <section className="fiche mt-10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[var(--color-tableau)]">Formation APC</h2>
          <span className="font-mono text-sm text-[var(--color-encre)]/60">
            {modulesTermines}/{totalModules} modules terminés
          </span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-kraft-fonce)]">
          <div className="h-full bg-[var(--color-rouge-encre)] transition-all" style={{ width: `${progressionPct}%` }} />
        </div>
        <p className="mt-3 text-sm text-[var(--color-encre)]/70">
          {progressionPct === 100
            ? "Bravo, vous avez parcouru tous les modules du guide APC !"
            : "Poursuivez votre formation à l'Approche Par Compétences module après module."}
        </p>
        <Link to="/guide-apc" className="mt-3 inline-block text-sm font-semibold text-[var(--color-rouge-encre)] hover:underline">
          Continuer la formation →
        </Link>
      </section>

      {/* Publications */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-[var(--color-tableau)]">Mes épreuves publiées</h2>
        {chargement ? (
          <p className="mt-3 text-sm text-[var(--color-encre)]/60">Chargement…</p>
        ) : publications.epreuves.length === 0 ? (
          <p className="fiche mt-3 p-6 text-sm text-[var(--color-encre)]/70">Vous n'avez pas encore publié d'épreuve.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publications.epreuves.map((ep) => (
              <Link key={ep.id} to={`/epreuves/${ep.id}`} className="fiche p-4">
                <Tampon>{LIBELLES_TYPE[ep.type] || ep.type}</Tampon>
                <p className="mt-2 font-display font-semibold">{ep.titre}</p>
                <p className="mt-1 text-xs text-[var(--color-encre)]/60">{ep.telechargements} téléchargements</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold text-[var(--color-tableau)]">Mes documents publiés</h2>
        {chargement ? (
          <p className="mt-3 text-sm text-[var(--color-encre)]/60">Chargement…</p>
        ) : publications.documents.length === 0 ? (
          <p className="fiche mt-3 p-6 text-sm text-[var(--color-encre)]/70">Vous n'avez pas encore publié de document.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publications.documents.map((d) => (
              <Link key={d.id} to={`/documents/${d.id}`} className="fiche p-4">
                <Tampon couleur="ocre">{LIBELLES_CATEGORIE[d.categorie] || d.categorie}</Tampon>
                <p className="mt-2 font-display font-semibold">{d.titre}</p>
                <p className="mt-1 text-xs text-[var(--color-encre)]/60">{d.telechargements} téléchargements</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
