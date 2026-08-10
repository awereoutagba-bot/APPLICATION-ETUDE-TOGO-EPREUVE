import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RouteProtegee({ children, rolesAutorises }) {
  const { user, chargement } = useAuth();

  if (chargement) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm">Chargement…</div>;
  }
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
  if (rolesAutorises && !rolesAutorises.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
