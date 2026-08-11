import type { Metadata } from "next";
import SourceNote from "@/components/SourceNote";
import { hospitales } from "@/lib/data";

export const metadata: Metadata = {
  title: "Estado de la red hospitalaria",
};

const ESTADO_TONE: Record<string, string> = {
  Evacuada: "bg-red-100 text-red-800",
  Inoperativa: "bg-red-100 text-red-800",
  "Daño grave": "bg-red-100 text-red-800",
  "Saturado (100%)": "bg-amber-100 text-amber-800",
  "En evaluación": "bg-amber-100 text-amber-800",
  "Afectación media": "bg-amber-100 text-amber-800",
  "Afectación técnica": "bg-amber-100 text-amber-800",
  "Afectación estructural": "bg-amber-100 text-amber-800",
};

export default function SaludPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Estado de la red hospitalaria</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Resumen de instituciones de salud afectadas, evacuadas o en
        evaluación en las zonas del sismo.
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200 mb-8">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-4 py-2">Ciudad / Región</th>
              <th className="px-4 py-2 text-center">Daño grave / Evacuadas</th>
              <th className="px-4 py-2 text-center">En evaluación / Saturadas</th>
              <th className="px-4 py-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {hospitales.resumen_por_ciudad.map((r) => (
              <tr key={r.ciudad} className="border-t border-slate-200">
                <td className="px-4 py-2 font-medium">{r.ciudad}</td>
                <td className="px-4 py-2 text-center">{r.dano_grave_evacuadas}</td>
                <td className="px-4 py-2 text-center">{r.en_evaluacion_saturadas}</td>
                <td className="px-4 py-2 text-center font-semibold">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hospitales.necesidades_urgentes.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-5 mb-8">
          <h2 className="font-semibold text-red-900 mb-2">Necesidades urgentes</h2>
          <ul className="space-y-1 text-red-900">
            {hospitales.necesidades_urgentes.map((n, i) => (
              <li key={i}>
                <strong>{n.zona}:</strong> {n.necesidad} — {n.responsable}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">Instituciones por estado</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {hospitales.instituciones.map((inst) => (
          <div key={inst.nombre} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{inst.nombre}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${ESTADO_TONE[inst.estado] ?? "bg-slate-100 text-slate-700"}`}>
                {inst.estado}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{inst.ciudad}</div>
            <p className="text-sm text-slate-600 mt-1">{inst.detalle}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <SourceNote fuente={hospitales.fuente} corte={hospitales.corte} />
      </div>
    </div>
  );
}
