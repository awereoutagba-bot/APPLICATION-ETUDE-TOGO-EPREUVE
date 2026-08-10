import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const liens = [
  { to: "/epreuves", label: "Épreuves" },
  { to: "/documents", label: "Documents" },
  { to: "/guide-apc", label: "Guide APC" },
];

export default function Navbar() {
  const { user, deconnecter } = useAuth();
  const [ouvert, setOuvert] = useState(false);
  const navigate = useNavigate();

  function seDeconnecter() {
    deconnecter();
    navigate("/");
  }

  const espacePerso = user
    ? user.role === "ENSEIGNANT"
      ? "/espace-enseignant"
      : user.role === "ELEVE"
      ? "/espace-eleve"
      : "/epreuves"
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-kraft-fonce)] bg-[var(--color-kraft)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOuvert(false)}>
          <div className="flag-badge">
            <span className="text-[0.85rem] font-bold">TG</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-tableau)]/70">Etude</p>
            <p className="font-display text-xl font-bold text-[var(--color-tableau)]">Togo</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {liens.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-medium text-sm transition-colors ${
                  isActive ? "text-[var(--color-rouge-encre)]" : "text-[var(--color-encre)] hover:text-[var(--color-tableau)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/ajouter"
                className="rounded-sm bg-[var(--color-tableau)] px-4 py-2 text-sm font-semibold text-[var(--color-craie)] transition-transform hover:-translate-y-0.5"
              >
                + Ajouter
              </Link>
              <Link to={espacePerso} className="text-sm font-medium text-[var(--color-encre)] hover:text-[var(--color-tableau)]">
                {user.prenom}
              </Link>
              <button
                onClick={seDeconnecter}
                className="text-sm font-medium text-[var(--color-rouge-encre)] hover:underline"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="text-sm font-medium text-[var(--color-encre)] hover:text-[var(--color-tableau)]">
                Connexion
              </Link>
              <Link
                to="/inscription"
                className="rounded-sm bg-[var(--color-tableau)] px-4 py-2 text-sm font-semibold text-[var(--color-craie)] transition-transform hover:-translate-y-0.5"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOuvert((o) => !o)}
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-[var(--color-encre)]" />
            <span className="block h-0.5 w-6 bg-[var(--color-encre)]" />
            <span className="block h-0.5 w-6 bg-[var(--color-encre)]" />
          </div>
        </button>
      </div>

      {ouvert && (
        <div className="border-t border-[var(--color-kraft-fonce)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {liens.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={() => setOuvert(false)} className="font-medium text-sm">
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link to="/ajouter" onClick={() => setOuvert(false)} className="font-medium text-sm text-[var(--color-tableau)]">
                  + Ajouter une épreuve/document
                </Link>
                <Link to={espacePerso} onClick={() => setOuvert(false)} className="font-medium text-sm">
                  Mon espace ({user.prenom})
                </Link>
                <button onClick={seDeconnecter} className="text-left font-medium text-sm text-[var(--color-rouge-encre)]">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setOuvert(false)} className="font-medium text-sm">
                  Connexion
                </Link>
                <Link to="/inscription" onClick={() => setOuvert(false)} className="font-medium text-sm text-[var(--color-tableau)]">
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
