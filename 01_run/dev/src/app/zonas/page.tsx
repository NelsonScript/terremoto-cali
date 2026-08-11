import Link from "next/link";
import type { Metadata } from "next";
import { zonas, getCifraZona } from "@/lib/data";

export const metadata: Metadata = {
  title: "Zonas afectadas",
};

export default function ZonasPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Zonas afectadas</h1>
      <p className="text-slate-600 mb-6">
        Cada zona vive un momento distinto de la emergencia. Elige la tuya
        para ver su situación y necesidades específicas.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {zonas.map((z) => {
          const cifra = getCifraZona(z.id);
          return (
            <Link
              key={z.id}
              href={`/zonas/${z.id}`}
              className="rounded-xl border border-slate-200 p-5 hover:border-red-400 hover:shadow-sm transition-colors"
            >
              <div className="font-semibold text-lg">{z.nombre}</div>
              <div className="text-slate-400 text-sm">{z.region}</div>
              <p className="text-sm text-slate-600 mt-2">{z.resumen}</p>
              {cifra?.fallecidos != null && (
                <p className="text-sm text-red-700 mt-2 font-medium">
                  {cifra.fallecidos} fallecidos reportados
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
