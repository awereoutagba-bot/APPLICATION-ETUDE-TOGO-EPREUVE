import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { marked } from "marked";
import { api, messageErreur } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function GuideAPCDetail() {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [tousModules, setTousModules] = useState([]);
  const [termine, setTermine] = useState(false);
  const [erreur, setErreur] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setErreur("");
    Promise.all([api.get(`/apc-guide/${id}`), api.get("/apc-guide")])
      .then(([modRes, listeRes]) => {
        setModule(modRes.data.module);
        setTousModules(listeRes.data.modules);
      })
      .catch((err) => setErreur(messageErreur(err)));

    if (user) {
      api.get("/apc-guide/progression").then((res) => {
        setTermine(res.data.progressions.some((p) => p.moduleId === id && p.termine));
      });
    }
  }, [id, user]);

  async function marquerTermine() {
    if (!user) {
      navigate("/connexion", { state: { from: `/guide-apc/${id}` } });
      return;
    }
    await api.post(`/apc-guide/${id}/terminer`);
    setTermine(true);
  }

  if (erreur) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"><p className="text-[var(--color-rouge-encre)]">{erreur}</p></div>;
  }
  if (!module) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm sm:px-6">Chargement…</div>;
  }

  const index = tousModules.findIndex((m) => m.id === module.id);
  const precedent = index > 0 ? tousModules[index - 1] : null;
  const suivant = index >= 0 && index < tousModules.length - 1 ? tousModules[index + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/guide-apc" className="text-sm font-medium text-[var(--color-tableau)] hover:underline">
        ← Tous les modules
      </Link>

      <div className="fiche mt-4 p-8">
        <div className="flex items-center justify-between">
          <span className="tampon tampon--ocre">Module {module.ordre}</span>
          <span className="font-mono text-xs text-[var(--color-encre)]/50">{module.dureeMin} min de lecture</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold text-[var(--color-tableau)]">{module.titre}</h1>
        <p className="mt-2 text-[var(--color-encre)]/70">{module.resume}</p>

        <div
          className="contenu-apc mt-8 max-w-none text-[var(--color-encre)]"
          dangerouslySetInnerHTML={{ __html: marked.parse(module.contenu) }}
        />

        <div className="mt-8 border-t border-[var(--color-kraft-fonce)] pt-6">
          <button
            onClick={marquerTermine}
            disabled={termine}
            className={`rounded-sm px-6 py-3 text-sm font-semibold ${
              termine
                ? "bg-[var(--color-kraft-fonce)] text-[var(--color-encre)]/60"
                : "bg-[var(--color-tableau)] text-[var(--color-craie)]"
            }`}
          >
            {termine ? "✓ Module terminé" : "Marquer comme terminé"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        {precedent ? (
          <Link to={`/guide-apc/${precedent.id}`} className="font-medium text-[var(--color-tableau)] hover:underline">
            ← {precedent.titre}
          </Link>
        ) : <span />}
        {suivant && (
          <Link to={`/guide-apc/${suivant.id}`} className="font-medium text-[var(--color-tableau)] hover:underline">
            {suivant.titre} →
          </Link>
        )}
      </div>
    </div>
  );
}
