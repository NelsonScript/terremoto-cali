import type { EstadoSemantico } from "@/lib/data";

const LABELS: Record<EstadoSemantico, string> = {
  critico: "Crítico",
  "en-evaluacion": "En evaluación",
  "sin-datos": "Sin datos",
};

const CLASSES: Record<EstadoSemantico, string> = {
  critico: "bg-red-700 text-white",
  "en-evaluacion": "bg-amber-700 text-white",
  "sin-datos": "bg-slate-400 text-white",
};

export default function EstadoBadge({ estado }: { estado: EstadoSemantico }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${CLASSES[estado]}`}>
      {LABELS[estado].toUpperCase()}
    </span>
  );
}
