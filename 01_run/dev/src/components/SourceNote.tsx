import { formatFecha } from "@/lib/data";

export default function SourceNote({
  fuente,
  corte,
}: {
  fuente: string;
  corte: string;
}) {
  return (
    <p className="nota" style={{ marginTop: 8 }}>
      Fuente: {fuente} · Corte: {formatFecha(corte)}
    </p>
  );
}
