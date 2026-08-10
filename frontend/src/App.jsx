import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RouteProtegee from "./components/RouteProtegee";

import Accueil from "./pages/Accueil";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Epreuves from "./pages/Epreuves";
import EpreuveDetail from "./pages/EpreuveDetail";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import Ajouter from "./pages/Ajouter";
import EspaceEleve from "./pages/EspaceEleve";
import EspaceEnseignant from "./pages/EspaceEnseignant";
import GuideAPC from "./pages/GuideAPC";
import GuideAPCDetail from "./pages/GuideAPCDetail";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />

          <Route path="/epreuves" element={<Epreuves />} />
          <Route path="/epreuves/:id" element={<EpreuveDetail />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<DocumentDetail />} />

          <Route
            path="/ajouter"
            element={
              <RouteProtegee>
                <Ajouter />
              </RouteProtegee>
            }
          />

          <Route
            path="/espace-eleve"
            element={
              <RouteProtegee rolesAutorises={["ELEVE"]}>
                <EspaceEleve />
              </RouteProtegee>
            }
          />
          <Route
            path="/espace-enseignant"
            element={
              <RouteProtegee rolesAutorises={["ENSEIGNANT", "ADMIN"]}>
                <EspaceEnseignant />
              </RouteProtegee>
            }
          />

          <Route path="/guide-apc" element={<GuideAPC />} />
          <Route path="/guide-apc/:id" element={<GuideAPCDetail />} />

          <Route
            path="*"
            element={
              <div className="mx-auto max-w-xl px-4 py-24 text-center">
                <p className="tampon tampon--rouge">404</p>
                <h1 className="mt-4 font-display text-2xl font-bold text-[var(--color-tableau)]">
                  Cette page n'existe pas
                </h1>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
