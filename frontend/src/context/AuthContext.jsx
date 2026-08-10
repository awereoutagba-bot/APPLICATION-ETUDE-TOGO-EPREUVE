import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("et_token");
    if (!token) {
      setChargement(false);
      return;
    }
    api
      .get("/auth/moi")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("et_token"))
      .finally(() => setChargement(false));
  }, []);

  function connecter(token, userData) {
    localStorage.setItem("et_token", token);
    setUser(userData);
  }

  function deconnecter() {
    localStorage.removeItem("et_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, chargement, connecter, deconnecter }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
