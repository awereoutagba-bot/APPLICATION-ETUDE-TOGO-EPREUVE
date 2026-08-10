import { Link } from "react-router-dom";
import Tampon from "./Tampon";
import { LIBELLES_TYPE, LIBELLES_CATEGORIE } from "../constants";

export default function EpreuveCard({ epreuve }) {
  return (
    <Link
      to={`/epreuves/${epreuve.id}`}
      className="fiche group flex flex-col justify-between p-5 transition-transform hover:-translate-y-1"
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <Tampon couleur={epreuve.type === "BAC" || epreuve.type === "BEPC" || epreuve.type === "CONCOURS" ? "rouge" : epreuve.type === "EXAMEN_BLANC" ? "ocre" : "vert"}>
            {LIBELLES_TYPE[epreuve.type] || epreuve.type}
          </Tampon>
          <span className="font-mono text-xs text-[var(--color-encre)]/50">{epreuve.annee}</span>
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-[var(--color-encre)] group-hover:text-[var(--color-tableau)]">
          {epreuve.titre}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-encre)]/70">
          {epreuve.matiere} · {epreuve.niveau}
          {epreuve.serie ? ` · Série ${epreuve.serie}` : ""}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-kraft-fonce)] pt-3 text-xs text-[var(--color-encre)]/60">
        <span>
          Déposé par {epreuve.auteur?.prenom} {epreuve.auteur?.nom}
        </span>
        <span>{epreuve.telechargements} téléchargement{epreuve.telechargements > 1 ? "s" : ""}</span>
      </div>
    </Link>
  );
}

export function DocumentCard({ document }) {
  return (
    <Link
      to={`/documents/${document.id}`}
      className="fiche group flex flex-col justify-between p-5 transition-transform hover:-translate-y-1"
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <Tampon couleur="ocre">{LIBELLES_CATEGORIE[document.categorie] || document.categorie}</Tampon>
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-[var(--color-encre)] group-hover:text-[var(--color-tableau)]">
          {document.titre}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-encre)]/70">
          {document.matiere} · {document.niveau}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-kraft-fonce)] pt-3 text-xs text-[var(--color-encre)]/60">
        <span>
          Déposé par {document.auteur?.prenom} {document.auteur?.nom}
        </span>
        <span>{document.telechargements} téléchargement{document.telechargements > 1 ? "s" : ""}</span>
      </div>
    </Link>
  );
}
