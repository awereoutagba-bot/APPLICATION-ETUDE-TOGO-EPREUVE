import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import EpreuveCard from "../components/EpreuveCard";

export default function EspaceEleve() {
  const { user } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [recommandees, setRecommandees] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/users/moi/favoris"),
      api.get("/epreuves", { params: { niveau: user?.niveau || undefined, taille: 6 } }),
    ])
      .then(([favRes, epRes]) => {
        setFavoris(favRes.data.favoris);
        setRecommandees(epRes.data.items);
      })
      .finally(() => setChargement(false));
  }, [user]);

  async function retirerFavori(id) {
    await api.delete(`/users/moi/favoris/${id}`);
    setFavoris((f) => f.filter((fav) => fav.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="tampon tampon--rouge">Espace élève</span>
      <h1 className="mt-3 font-display text-3xl font-bold text-[var(--color-tableau)]">
        Salut {user?.prenom} 👋
      </h1>
      <p className="mt-1 text-sm text-[var(--color-encre)]/70">
        {user?.niveau ? `Niveau ${user.niveau}` : "Complète ton niveau depuis ton profil pour de meilleures suggestions."}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/epreuves" className="rounded-sm bg-[var(--color-tableau)] px-5 py-2.5 text-sm font-semibold text-[var(--color-craie)]">
          Parcourir les épreuves
        </Link>
        <Link to="/ajouter" className="rounded-sm border-2 border-[var(--color-tableau)] px-5 py-2.5 text-sm font-semibold text-[var(--color-tableau)]">
          Déposer une ressource
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-[var(--color-tableau)]">Mes favoris</h2>
        {chargement ? (
          <p className="mt-3 text-sm text-[var(--color-encre)]/60">Chargement…</p>
        ) : favoris.length === 0 ? (
          <p className="fiche mt-3 p-6 text-sm text-[var(--color-encre)]/70">
            Aucun favori pour l'instant. Cliquez sur « ★ Ajouter aux favoris » sur une épreuve ou un document.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoris.map((f) => (
              <div key={f.id} className="fiche p-4">
                {f.epreuve ? (
                  <Link to={`/epreuves/${f.epreuve.id}`} className="font-display font-semibold text-[var(--color-tableau)] hover:underline">
                    {f.epreuve.titre}
                  </Link>
                ) : (
                  <Link to={`/documents/${f.document.id}`} className="font-display font-semibold text-[var(--color-tableau)] hover:underline">
                    {f.document.titre}
                  </Link>
                )}
                <button
                  onClick={() => retirerFavori(f.id)}
                  className="mt-2 block text-xs font-medium text-[var(--color-rouge-encre)] hover:underline"
                >
                  Retirer des favoris
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-[var(--color-tableau)]">
          {user?.niveau ? `Suggestions pour le niveau ${user.niveau}` : "Épreuves récentes"}
        </h2>
        {chargement ? (
          <p className="mt-3 text-sm text-[var(--color-encre)]/60">Chargement…</p>
        ) : recommandees.length === 0 ? (
          <p className="fiche mt-3 p-6 text-sm text-[var(--color-encre)]/70">Aucune épreuve trouvée pour ce niveau pour l'instant.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommandees.map((ep) => (
              <EpreuveCard key={ep.id} epreuve={ep} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
