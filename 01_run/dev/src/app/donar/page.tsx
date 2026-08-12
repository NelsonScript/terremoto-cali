import type { Metadata } from "next";
import AlertBanner from "@/components/AlertBanner";
import { departamentos, acopioBogota } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cómo donar",
};

export default function DonarPage() {
  const conNecesidades = departamentos.filter((d) => d.necesidades.length > 0);

  return (
    <div>
      <AlertBanner />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Cómo donar</h1>
        <p className="text-slate-600 mb-6 max-w-2xl">
          Lo que se necesita cambia día a día y varía por departamento. Dona
          lo que está pidiendo la zona específica, no lo genérico — así
          evitas que la ayuda se acumule sin uso mientras falta lo urgente.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {conNecesidades.map((d) => (
            <div key={d.id} className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold">{d.nombre}</h2>
              <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                {d.necesidades.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
              {d.puntos_acopio.length > 0 && (
                <p className="text-sm text-slate-600 mt-3">
                  <strong>Punto de acopio:</strong> {d.puntos_acopio.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200 p-6 mb-10">
          <h2 className="font-semibold mb-1">Centros de acopio en Bogotá (Cruz Roja)</h2>
          <p className="text-sm text-slate-600 mb-3">
            Si estás fuera de las zonas afectadas, estos puntos en Bogotá
            reciben donaciones en especie. Horario general: {acopioBogota.horario_general}.
          </p>
          <ul className="text-sm text-slate-700 space-y-2">
            {acopioBogota.puntos.map((p) => (
              <li key={p.nombre}>
                <strong>{p.nombre}:</strong> {p.direccion}
                {p.nota && <span className="text-slate-500"> · {p.nota}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-red-300 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900 mb-2">Donaciones en dinero</h2>
          <p className="text-red-900">
            Canaliza cualquier donación económica <strong>únicamente a
            través de la Cruz Roja Colombiana</strong>. Las autoridades han
            insistido en este único canal para evitar fraudes en cuentas
            falsas y optimizar la cadena de suministro humanitario.
          </p>
        </div>
      </div>
    </div>
  );
}
