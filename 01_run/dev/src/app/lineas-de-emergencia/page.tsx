import type { Metadata } from "next";
import { lineas } from "@/lib/data";

export const metadata: Metadata = {
  title: "Líneas de emergencia",
};

export default function LineasPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Líneas de emergencia</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Guarda estos números. Si hay riesgo de vida, llama primero antes de
        usar cualquier formulario en esta web.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {lineas.map((l) => (
          <div key={l.nombre} className="rounded-xl border border-slate-200 p-5">
            <div className="text-3xl font-bold text-red-700 tabular-nums">{l.numero}</div>
            <div className="font-medium mt-1">{l.nombre}</div>
            <div className="text-xs text-slate-500 mt-1">{l.cobertura}</div>
            {l.nota && <p className="text-xs text-slate-500 mt-2">{l.nota}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
