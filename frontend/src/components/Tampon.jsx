const COULEURS_TYPE = {
  BAC: "rouge",
  BEPC: "rouge",
  CONCOURS: "rouge",
  COMPOSITION: "vert",
  DEVOIR: "vert",
  EXAMEN_BLANC: "ocre",
  CORRIGE: "ocre",
  NOUVEAU: "rouge",
};

export default function Tampon({ children, couleur }) {
  const c = couleur || COULEURS_TYPE[children] || "vert";
  return <span className={`tampon tampon--${c}`}>{children}</span>;
}
