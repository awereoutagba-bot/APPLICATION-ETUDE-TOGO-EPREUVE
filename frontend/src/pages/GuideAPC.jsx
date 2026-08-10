import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function GuideAPC() {
  const [modules, setModules] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const requetes = [api.get("/apc-guide")];
    if (user) requetes.push(api.get("/apc-guide/progression"));

    Promise.all(requetes)
      .then(([modRes, progRes]) => {
        setModules(modRes.data.modules);
        if (progRes) setProgressions(progRes.data.progressions);
      })
      .finally(() => setChargement(false));
  }, [user]);

  function estTermine(moduleId) {
    return progressions.some((p) => p.moduleId === moduleId && p.termine);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <span className="tampon tampon--ocre">Formation continue</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-[var(--color-tableau)]">
        Guide de l'Approche Par Compétences
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--color-encre)]/75">
        L'APC (Approche Par Compétences) est le référentiel pédagogique en vigueur au Togo. Ce guide, en{" "}
        {modules.length || "quelques"} modules courts, vous accompagne pas à pas : comprendre l'APC, construire une
        situation-problème, planifier une séquence, évaluer par compétences, et adapter votre pratique aux classes
        à gros effectif.
      </p>

      {chargement ? (
        <p className="mt-8 text-sm text-[var(--color-encre)]/60">Chargement…</p>
      ) : (
        <ol className="mt-8 space-y-4">
          {modules.map((m) => {
            const termine = estTermine(m.id);
            return (
              <li key={m.id}>
                <Link to={`/guide-apc/${m.id}`} className="fiche flex items-center gap-5 p-5 transition-transform hover:-translate-y-0.5">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${
                      termine ? "bg-[var(--color-tableau)] text-[var(--color-craie)]" : "border-2 border-[var(--color-kraft-fonce)] text-[var(--color-encre)]/60"
                    }`}
                  >
                    {termine ? "✓" : m.ordre}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-lg font-semibold text-[var(--color-encre)]">{m.titre}</p>
                    <p className="mt-1 text-sm text-[var(--color-encre)]/70">{m.resume}</p>
                  </div>
                  <span className="hidden shrink-0 font-mono text-xs text-[var(--color-encre)]/50 sm:block">{m.dureeMin} min</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      {!user && (
        <div className="fiche mt-10 p-6 text-sm text-[var(--color-encre)]/75">
          <Link to="/connexion" className="font-semibold text-[var(--color-rouge-encre)] hover:underline">
            Connectez-vous
          </Link>{" "}
          pour suivre votre progression module par module.
        </div>
      )}
    </div>
  );
}
