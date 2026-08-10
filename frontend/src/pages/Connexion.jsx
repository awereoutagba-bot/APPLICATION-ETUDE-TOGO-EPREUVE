import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api, messageErreur } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function soumettre(e) {
    e.preventDefault();
    setErreur("");
    setEnvoi(true);
    try {
      const res = await api.post("/auth/connexion", { email, motDePasse });
      connecter(res.data.token, res.data.user);
      navigate(location.state?.from || "/");
    } catch (err) {
      setErreur(messageErreur(err));
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="fiche p-8">
        <span className="tampon tampon--vert">Connexion</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-[var(--color-tableau)]">Content de te revoir</h1>
        <p className="mt-1 text-sm text-[var(--color-encre)]/70">Connecte-toi pour ajouter ou retrouver tes ressources.</p>

        <form className="mt-6 space-y-4" onSubmit={soumettre}>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-[var(--color-kraft-fonce)] bg-[var(--color-craie)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-tableau)]"
              placeholder="toi@exemple.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              required
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full rounded-sm border border-[var(--color-kraft-fonce)] bg-[var(--color-craie)] px-3 py-2.5 text-sm outline-none focus:border-[var(--color-tableau)]"
              placeholder="••••••••"
            />
          </div>

          {erreur && <p className="text-sm text-[var(--color-rouge-encre)]">{erreur}</p>}

          <button
            type="submit"
            disabled={envoi}
            className="w-full rounded-sm bg-[var(--color-tableau)] px-4 py-2.5 text-sm font-semibold text-[var(--color-craie)] disabled:opacity-60"
          >
            {envoi ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-encre)]/70">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-semibold text-[var(--color-rouge-encre)] hover:underline">
            Créer un compte
          </Link>
        </p>

        <div className="mt-6 border-t border-[var(--color-kraft-fonce)] pt-4 text-xs text-[var(--color-encre)]/50">
          Comptes de démo : <code>eleve@etudetogo.tg</code> / <code>enseignant@etudetogo.tg</code> — mot de passe{" "}
          <code>motdepasse123</code>
        </div>
      </div>
    </div>
  );
}
