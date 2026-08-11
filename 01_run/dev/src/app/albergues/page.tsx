import type { Metadata } from "next";
import { albergues, zonas } from "@/lib/data";

export const metadata: Metadata = {
  title: "Albergues y puntos de acopio",
};

export default function AlberguesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Albergues y puntos de acopio</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Directorio de sitios habilitados para alojar a familias damnificadas
        y recibir donaciones. Se irá ampliando por zona a medida que se
        habiliten nuevos puntos.
      </p>

      {albergues.length === 0 ? (
        <p className="text-slate-500">Aún no hay puntos registrados.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {albergues.map((a) => {
            const zona = zonas.find((z) => z.id === a.zona);
            return (
              <div key={a.nombre} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{a.nombre}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      a.tipo === "Albergue temporal"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {a.tipo}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {zona?.nombre ?? a.zona} · {a.direccion}
                </div>
                <div className="text-xs text-slate-500 mt-1">Estado: {a.estado}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
