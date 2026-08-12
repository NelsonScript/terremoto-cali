const BORDE: Record<string, string> = {
  critical: "var(--critico)",
  warning: "var(--evaluacion)",
  ok: "var(--operativo)",
  neutral: "var(--tinta)",
};

/** Puerto fiel de TarjetaCifra.js (referencia de diseño). */
export default function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string | number | null;
  tone?: "critical" | "warning" | "ok" | "neutral";
}) {
  const sinDato = value === null || value === undefined;
  return (
    <div
      style={{
        background: "var(--fondo-2)",
        borderLeft: "5px solid " + (sinDato ? "#9A998F" : BORDE[tone]),
        padding: "10px 12px",
      }}
    >
      <div
        className="cifra"
        style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: sinDato ? "var(--gris)" : "var(--tinta)" }}
      >
        {sinDato ? "—" : typeof value === "number" ? value.toLocaleString("es-CO") : value}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--gris)" }}>{sinDato ? "Sin dato confirmado" : ""}</div>
    </div>
  );
}
