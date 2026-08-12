import type { ReactNode } from "react";

const ESTILOS: Record<string, React.CSSProperties> = {
  critico: { background: "var(--critico)", color: "#fff", border: "none" },
  aviso: { background: "var(--evaluacion-suave)", color: "var(--tinta-2)", border: "2px solid var(--evaluacion)" },
  resuelto: { background: "var(--fondo)", color: "var(--tinta-2)", borderLeft: "5px solid var(--operativo)" },
};

/** Puerto fiel de BannerAlerta.js (referencia de diseño). */
export default function BannerAlerta({
  nivel = "critico",
  titulo,
  children,
}: {
  nivel?: "critico" | "aviso" | "resuelto";
  titulo?: string;
  children: ReactNode;
}) {
  return (
    <div
      role={nivel === "critico" ? "alert" : undefined}
      style={{ padding: 16, fontSize: 15, lineHeight: 1.5, ...ESTILOS[nivel] }}
    >
      {titulo && <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{titulo}</div>}
      {children}
    </div>
  );
}
