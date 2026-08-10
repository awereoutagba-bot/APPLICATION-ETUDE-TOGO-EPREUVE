import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import EpreuveCard from "../components/EpreuveCard";
import { LIBELLES_TYPE } from "../constants";

export default function Epreuves() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [filtresDispo, setFiltresDispo] = useState({ matieres: [], niveaux: [], annees: [], types: [] });
  const [chargement, setChargement] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") || "");

  const matiere = searchParams.get("matiere") || "";
  const niveau = searchParams.get("niveau") || "";
  const annee = searchParams.get("annee") || "";
  const type = searchParams.get("type") || "";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    api.get("/epreuves/filtres").then((res) => setFiltresDispo(res.data)).catch(() => {});
  }, []);

  const charger = useCallback(() => {
    setChargement(true);
    api
      .get("/epreuves", { params: { q: searchParams.get("q") || undefined, matiere: matiere || undefined, niveau: niveau || undefined, annee: annee || undefined, type: type || undefined, page, taille: 12 } })
      .then((res) => {
        setItems(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setItems([]))
      .finally(() => setChargement(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    charger();
  }, [charger]);

  function majFiltre(cle, valeur) {
    const params = new URLSearchParams(searchParams);
    if (valeur) params.set(cle, valeur);
    else params.delete(cle);
    if (cle !== "page") params.set("page", "1");
    setSearchParams(params);
  }

  function soumettreRecherche(e) {
    e.preventDefault();
    majFiltre("q", q);
  }

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="tampon tampon--rouge">Bibliothèque</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-tableau)]">Épreuves</h1>
        <p className="mt-1 text-sm text-[var(--color-encre)]/70">
          {total} épreuve{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
        </p>
      </div>

      <form onSubmit={soumettreRecherche} className="fiche mb-6 flex gap-2 p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un titre, une matière…"
          className="flex-1 bg-transparent px-2 text-sm outline-none"
        />
        <button type="submit" className="rounded-sm bg-[var(--color-tableau)] px-4 py-2 text-sm font-semibold text-[var(--color-craie)]">
          Chercher
        </button>
      </form>

      <div className="mb-8 flex flex-wrap gap-3">
        <select value={matiere} onChange={(e) => majFiltre("matiere", e.target.value)} className="champ w-auto">
          <option value="">Toutes les matières</option>
          {filtresDispo.matieres.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={niveau} onChange={(e) => majFiltre("niveau", e.target.value)} className="champ w-auto">
          <option value="">Tous les niveaux</option>
          {filtresDispo.niveaux.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select value={annee} onChange={(e) => majFiltre("annee", e.target.value)} className="champ w-auto">
          <option value="">Toutes les années</option>
          {filtresDispo.annees.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select value={type} onChange={(e) => majFiltre("type", e.target.value)} className="champ w-auto">
          <option value="">Tous les types</option>
          {filtresDispo.types.map((t) => (
            <option key={t} value={t}>{LIBELLES_TYPE[t] || t}</option>
          ))}
        </select>
        {(matiere || niveau || annee || type || searchParams.get("q")) && (
          <button
            onClick={() => {
              setQ("");
              setSearchParams({});
            }}
            className="text-sm font-medium text-[var(--color-rouge-encre)] hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {chargement ? (
        <p className="text-sm text-[var(--color-encre)]/60">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="fiche p-10 text-center">
          <p className="font-display text-lg font-semibold">Aucun résultat</p>
          <p className="mt-2 text-sm text-[var(--color-encre)]/70">
            Essayez d'élargir votre recherche, ou soyez le premier à déposer cette épreuve.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((ep) => (
              <EpreuveCard key={ep.id} epreuve={ep} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => majFiltre("page", String(p))}
                  className={`h-9 w-9 rounded-sm text-sm font-semibold ${
                    p === page ? "bg-[var(--color-tableau)] text-[var(--color-craie)]" : "border border-[var(--color-kraft-fonce)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
