import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, messageErreur } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { NIVEAUX, MATIERES } from "../constants";

export default function Inscription() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    motDePasse: "",
    role: "ELEVE",
    niveau: "",
    matiere: "",
    etablissement: "",
  });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const { connecter } = useAuth();
  const navigate = useNavigate();

  function majChamp(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  async function soumettre(e) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const res = await api.post("/auth/inscription", form);
      connecter(res.data.token, res.data.user);
      navigate(form.role === "ENSEIGNANT" ? "/espace-enseignant" : "/espace-eleve");
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="fiche p-8">
        <span className="tampon tampon--rouge">Inscription</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-[var(--color-tableau)]">Rejoindre Etude Togo</h1>

        <div className="mt-5 flex gap-2">
          {[
            { valeur: "ELEVE", label: "Je suis élève" },
            { valeur: "ENSEIGNANT", label: "Je suis enseignant" },
          ].map((opt) => (
            <button
              key={opt.valeur}
              type="button"
              onClick={() => majChamp("role", opt.valeur)}
              className={`flex-1 rounded-sm border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                form.role === opt.valeur
                  ? "border-[var(--color-tableau)] bg-[var(--color-tableau)] text-[var(--color-craie)]"
                  : "border-[var(--color-kraft-fonce)] text-[var(--color-encre)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <form className="mt-5 space-y-4" onSubmit={soumettre}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Prénom</label>
              <input required value={form.prenom} onChange={(e) => majChamp("prenom", e.target.value)} className="champ" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nom</label>
              <input required value={form.nom} onChange={(e) => majChamp("nom", e.target.value)} className="champ" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={form.email} onChange={(e) => majChamp("email", e.target.value)} className="champ" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Mot de passe (6 caractères min.)</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.motDePasse}
              onChange={(e) => majChamp("motDePasse", e.target.value)}
              className="champ"
            />
          </div>

          {form.role === "ELEVE" ? (
            <div>
              <label className="mb-1 block text-sm font-medium">Niveau</label>
              <select value={form.niveau} onChange={(e) => majChamp("niveau", e.target.value)} className="champ">
                <option value="">Sélectionner…</option>
                {NIVEAUX.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-sm font-medium">Matière enseignée</label>
              <select value={form.matiere} onChange={(e) => majChamp("matiere", e.target.value)} className="champ">
                <option value="">Sélectionner…</option>
                {MATIERES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Établissement (facultatif)</label>
            <input value={form.etablissement} onChange={(e) => majChamp("etablissement", e.target.value)} className="champ" />
          </div>

          {erreur && <p className="text-sm text-[var(--color-rouge-encre)]">{erreur}</p>}

          <button
            type="submit"
            disabled={envoi}
            className="w-full rounded-sm bg-[var(--color-tableau)] px-4 py-2.5 text-sm font-semibold text-[var(--color-craie)] disabled:opacity-60"
          >
            {envoi ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-encre)]/70">
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="font-semibold text-[var(--color-rouge-encre)] hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
