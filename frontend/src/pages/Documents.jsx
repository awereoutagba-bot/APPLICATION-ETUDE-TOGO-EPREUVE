import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { DocumentCard } from "../components/EpreuveCard";
import { LIBELLES_CATEGORIE, MATIERES, NIVEAUX } from "../constants";

export default function Documents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") || "");

  const matiere = searchParams.get("matiere") || "";
  const niveau = searchParams.get("niveau") || "";
  const categorie = searchParams.get("categorie") || "";

  const charger = useCallback(() => {
    setChargement(true);
    api
      .get("/documents", { params: { q: searchParams.get("q") || undefined, matiere: matiere || undefined, niveau: niveau || undefined, categorie: categorie || undefined, taille: 24 } })
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
    setSearchParams(params);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="tampon tampon--ocre">Ressources</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-tableau)]">Documents</h1>
        <p className="mt-1 text-sm text-[var(--color-encre)]/70">
          Cours, fiches résumés, corrigés et programmes officiels — {total} document{total > 1 ? "s" : ""}.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          majFiltre("q", q);
        }}
        className="fiche mb-6 flex gap-2 p-3"
      >
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
          {MATIERES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={niveau} onChange={(e) => majFiltre("niveau", e.target.value)} className="champ w-auto">
          <option value="">Tous les niveaux</option>
          {NIVEAUX.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select value={categorie} onChange={(e) => majFiltre("categorie", e.target.value)} className="champ w-auto">
          <option value="">Toutes les catégories</option>
          {Object.entries(LIBELLES_CATEGORIE).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {chargement ? (
        <p className="text-sm text-[var(--color-encre)]/60">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="fiche p-10 text-center">
          <p className="font-display text-lg font-semibold">Aucun document pour l'instant</p>
          <p className="mt-2 text-sm text-[var(--color-encre)]/70">Déposez le premier document de cette catégorie.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <DocumentCard key={d.id} document={d} />
          ))}
        </div>
      )}
    </div>
  );
}
