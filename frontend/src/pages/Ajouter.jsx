import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, messageErreur } from "../api/client";
import { NIVEAUX, SERIES_BAC, MATIERES, LIBELLES_TYPE, LIBELLES_CATEGORIE } from "../constants";

const TYPES_EPREUVE = Object.keys(LIBELLES_TYPE);
const CATEGORIES_DOC = Object.keys(LIBELLES_CATEGORIE);

export default function Ajouter() {
  const [mode, setMode] = useState("epreuve"); // "epreuve" | "document"
  const [form, setForm] = useState({
    titre: "",
    matiere: "",
    niveau: "",
    serie: "",
    annee: new Date().getFullYear(),
    type: "DEVOIR",
    categorie: "COURS",
    region: "",
    description: "",
  });
  const [fichier, setFichier] = useState(null);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const navigate = useNavigate();

  function majChamp(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  async function soumettre(e) {
    e.preventDefault();
    setErreur("");
    setSucces("");

    if (!fichier) {
      setErreur("Ajoutez le fichier (PDF, Word ou image).");
      return;
    }

    const donnees = new FormData();
    donnees.append("fichier", fichier);
    donnees.append("titre", form.titre);
    donnees.append("matiere", form.matiere);
    donnees.append("niveau", form.niveau);
    donnees.append("description", form.description);

    if (mode === "epreuve") {
      donnees.append("serie", form.serie);
      donnees.append("annee", form.annee);
      donnees.append("type", form.type);
      donnees.append("region", form.region);
    } else {
      donnees.append("categorie", form.categorie);
    }

    setEnvoi(true);
    try {
      const res = await api.post(mode === "epreuve" ? "/epreuves" : "/documents", donnees, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSucces("Merci ! Votre ressource est en ligne.");
      const idCree = mode === "epreuve" ? res.data.epreuve.id : res.data.document.id;
      setTimeout(() => navigate(mode === "epreuve" ? `/epreuves/${idCree}` : `/documents/${idCree}`), 900);
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <span className="tampon tampon--rouge">Contribuer</span>
      <h1 className="mt-4 font-display text-3xl font-bold text-[var(--color-tableau)]">Ajouter une ressource</h1>
      <p className="mt-2 text-sm text-[var(--color-encre)]/70">
        Chaque dépôt profite à toute la communauté. Formats acceptés : PDF, DOC, DOCX, JPG, PNG (15 Mo max).
      </p>

      <div className="mt-6 flex gap-2">
        {[
          { valeur: "epreuve", label: "Une épreuve" },
          { valeur: "document", label: "Un document" },
        ].map((opt) => (
          <button
            key={opt.valeur}
            type="button"
            onClick={() => setMode(opt.valeur)}
            className={`flex-1 rounded-sm border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              mode === opt.valeur
                ? "border-[var(--color-tableau)] bg-[var(--color-tableau)] text-[var(--color-craie)]"
                : "border-[var(--color-kraft-fonce)] text-[var(--color-encre)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={soumettre} className="fiche mt-6 space-y-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Titre</label>
          <input
            required
            value={form.titre}
            onChange={(e) => majChamp("titre", e.target.value)}
            placeholder={mode === "epreuve" ? "Ex : BAC Mathématiques Série D 2023" : "Ex : Fiche résumé — Les fonctions numériques"}
            className="champ"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Matière</label>
            <select required value={form.matiere} onChange={(e) => majChamp("matiere", e.target.value)} className="champ">
              <option value="">Sélectionner…</option>
              {MATIERES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Niveau</label>
            <select required value={form.niveau} onChange={(e) => majChamp("niveau", e.target.value)} className="champ">
              <option value="">Sélectionner…</option>
              {NIVEAUX.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {mode === "epreuve" ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Type</label>
                <select value={form.type} onChange={(e) => majChamp("type", e.target.value)} className="champ">
                  {TYPES_EPREUVE.map((t) => (
                    <option key={t} value={t}>{LIBELLES_TYPE[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Année</label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  required
                  value={form.annee}
                  onChange={(e) => majChamp("annee", e.target.value)}
                  className="champ"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Série (facultatif)</label>
                <select value={form.serie} onChange={(e) => majChamp("serie", e.target.value)} className="champ">
                  <option value="">—</option>
                  {SERIES_BAC.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Région / ville (facultatif)</label>
              <input value={form.region} onChange={(e) => majChamp("region", e.target.value)} className="champ" placeholder="Ex : Lomé, Kara..." />
            </div>
          </>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium">Catégorie</label>
            <select value={form.categorie} onChange={(e) => majChamp("categorie", e.target.value)} className="champ">
              {CATEGORIES_DOC.map((c) => (
                <option key={c} value={c}>{LIBELLES_CATEGORIE[c]}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Description (facultatif)</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => majChamp("description", e.target.value)}
            className="champ resize-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Fichier</label>
          <input
            type="file"
            required
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFichier(e.target.files?.[0] || null)}
            className="champ file:mr-3 file:rounded-sm file:border-0 file:bg-[var(--color-tableau)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[var(--color-craie)]"
          />
        </div>

        {erreur && <p className="text-sm text-[var(--color-rouge-encre)]">{erreur}</p>}
        {succes && <p className="text-sm font-semibold text-[var(--color-tableau)]">{succes}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full rounded-sm bg-[var(--color-rouge-encre)] px-4 py-3 text-sm font-semibold text-[var(--color-craie)] disabled:opacity-60"
        >
          {envoi ? "Envoi en cours…" : "Publier"}
        </button>
      </form>
    </div>
  );
}
