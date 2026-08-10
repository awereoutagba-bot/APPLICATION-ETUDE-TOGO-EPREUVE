import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({ baseURL: `${BASE_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("et_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Aide pour extraire un message d'erreur lisible depuis une réponse API
export function messageErreur(err) {
  return err?.response?.data?.erreur || "Une erreur est survenue. Réessayez.";
}

export function urlFichier(chemin) {
  return `${BASE_URL}/fichiers/${chemin}`;
}

export { BASE_URL };
