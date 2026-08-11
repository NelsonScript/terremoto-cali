import { formatFecha } from "@/lib/data";

export default function SourceNote({
  fuente,
  corte,
}: {
  fuente: string;
  corte: string;
}) {
  return (
    <p className="text-xs text-slate-500 mt-2">
      Fuente: {fuente} · Corte: {formatFecha(corte)}
    </p>
  );
}
