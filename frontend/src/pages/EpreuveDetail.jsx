import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, BASE_URL, messageErreur } from "../api/client";
import Tampon from "../components/Tampon";
import { LIBELLES_TYPE } from "../constants";
import { useAuth } from "../context/AuthContext";

export default function EpreuveDetail() {
  const { id } = useParams();
  const [epreuve, setEpreuve] = useState(null);
  const [erreur, setErreur] = useState("");
  const [favoriMsg, setFavoriMsg] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api
      .get(`/epreuves/${id}`)
      .then((res) => setEpreuve(res.data.epreuve))
      .catch((err) => setErreur(messageErreur(err)));
  }, [id]);

  async function ajouterAuxFavoris() {
    try {
      await api.post("/users/moi/favoris", { epreuveId: id });
      setFavoriMsg("Ajouté à vos favoris ✓");
    } catch (err) {
      setFavoriMsg(messageErreur(err));
    }
  }

  if (erreur) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"><p className="text-[var(--color-rouge-encre)]">{erreur}</p></div>;
  }
  if (!epreuve) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm sm:px-6">Chargement…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/epreuves" className="text-sm font-medium text-[var(--color-tableau)] hover:underline">
        ← Retour aux épreuves
      </Link>

      <div className="fiche mt-4 p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Tampon couleur={["BAC", "BEPC", "CONCOURS"].includes(epreuve.type) ? "rouge" : epreuve.type === "EXAMEN_BLANC" ? "ocre" : "vert"}>
            {LIBELLES_TYPE[epreuve.type] || epreuve.type}
          </Tampon>
          <span className="font-mono text-sm text-[var(--color-encre)]/60">{epreuve.annee}</span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold text-[var(--color-tableau)]">{epreuve.titre}</h1>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[var(--color-kraft-fonce)] py-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-[var(--color-encre)]/50">Matière</dt>
            <dd className="mt-0.5 font-semibold">{epreuve.matiere}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-encre)]/50">Niveau</dt>
            <dd className="mt-0.5 font-semibold">{epreuve.niveau}</dd>
          </div>
          {epreuve.serie && (
            <div>
              <dt className="text-[var(--color-encre)]/50">Série</dt>
              <dd className="mt-0.5 font-semibold">{epreuve.serie}</dd>
            </div>
          )}
          <div>
            <dt className="text-[var(--color-encre)]/50">Téléchargements</dt>
            <dd className="mt-0.5 font-semibold">{epreuve.telechargements}</dd>
          </div>
        </dl>

        {epreuve.description && (
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-encre)]/80">{epreuve.description}</p>
        )}

        <p className="mt-5 text-sm text-[var(--color-encre)]/60">
          Déposé par <span className="font-semibold">{epreuve.auteur?.prenom} {epreuve.auteur?.nom}</span>
          {epreuve.auteur?.etablissement ? ` · ${epreuve.auteur.etablissement}` : ""}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`${BASE_URL}/api/epreuves/${id}/telecharger`}
            className="rounded-sm bg-[var(--color-tableau)] px-6 py-3 text-sm font-semibold text-[var(--color-craie)] transition-transform hover:-translate-y-0.5"
          >
            Télécharger le fichier
          </a>
          {user && (
            <button
              onClick={ajouterAuxFavoris}
              className="rounded-sm border-2 border-[var(--color-tableau)] px-6 py-3 text-sm font-semibold text-[var(--color-tableau)]"
            >
              ★ Ajouter aux favoris
            </button>
          )}
        </div>
        {favoriMsg && <p className="mt-3 text-sm text-[var(--color-encre)]/70">{favoriMsg}</p>}
      </div>
    </div>
  );
}
