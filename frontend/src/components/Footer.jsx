export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flag-badge">TG</div>
              <div>
                <p className="font-display text-lg font-bold">Etude Togo</p>
                <p className="text-sm text-[var(--color-craie)]/75">Plateforme éducative togolaise</p>
              </div>
            </div>
            <p className="text-sm text-[var(--color-craie)]/80">
              Partage de ressources scolaires et guide APC pour accompagner les enseignants et les élèves dans leurs révisions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-craie)]/70">Contenus</p>
              <ul className="mt-3 space-y-1 text-sm text-[var(--color-craie)]/85">
                <li>Épreuves BEPC/BAC</li>
                <li>Documents pédagogiques</li>
                <li>Guide APC</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-craie)]/70">Communauté</p>
              <ul className="mt-3 space-y-1 text-sm text-[var(--color-craie)]/85">
                <li>Déposer un document</li>
                <li>Favoris</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-[var(--color-craie)]/15 pt-6 text-xs text-[var(--color-craie)]/60">
          © {new Date().getFullYear()} Etude Togo — plateforme éducative communautaire.
        </p>
      </div>
    </footer>
  );
}
