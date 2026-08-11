import type { Metadata } from "next";
import AlertBanner from "@/components/AlertBanner";
import { zonas } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cómo donar",
};

export default function DonarPage() {
  return (
    <div>
      <AlertBanner />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Cómo donar</h1>
        <p className="text-slate-600 mb-6 max-w-2xl">
          Lo que se necesita cambia día a día y varía por zona. Dona lo que
          está pidiendo la zona específica, no lo genérico — así evitas que
          la ayuda se acumule sin uso mientras falta lo urgente.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {zonas.map((z) => (
            <div key={z.id} className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold">{z.nombre}</h2>
              {z.necesidades.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
                  {z.necesidades.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 mt-2">Sin necesidades específicas registradas aún.</p>
              )}
              {z.puntos_acopio.length > 0 && (
                <p className="text-sm text-slate-600 mt-3">
                  <strong>Punto de acopio:</strong> {z.puntos_acopio.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-red-300 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900 mb-2">Donaciones en dinero</h2>
          <p className="text-red-900">
            Canaliza cualquier donación económica <strong>únicamente a
            través de la Cruz Roja Colombiana</strong>. Las autoridades
            municipales han insistido en este único canal para evitar fraudes
            en cuentas falsas. Desconfía de cualquier colecta que te pida
            transferir dinero a una cuenta personal.
          </p>
        </div>
      </div>
    </div>
  );
}
