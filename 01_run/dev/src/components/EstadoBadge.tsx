import type { EstadoSemantico } from "@/lib/data";

const LABELS: Record<EstadoSemantico, string> = {
  critico: "CRÍTICO",
  "en-evaluacion": "EN EVAL.",
  "sin-datos": "SIN DATO",
};

const CLASES: Record<EstadoSemantico, string> = {
  critico: "critico",
  "en-evaluacion": "evaluacion",
  "sin-datos": "sin-dato",
};

export default function EstadoBadge({ estado }: { estado: EstadoSemantico }) {
  return <span className={`etiqueta ${CLASES[estado]}`}>{LABELS[estado]}</span>;
}
