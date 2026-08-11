import type { Metadata } from "next";
import { apoyoPrivado } from "@/lib/data";

export const metadata: Metadata = {
  title: "Apoyo del sector privado",
};

export default function ApoyoPrivadoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Apoyo del sector privado</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Empresas y organizaciones que ya están aportando a la respuesta.
        Reconocerlas también sirve para que más empresas se sumen.
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-4 py-2">Empresa / Grupo</th>
              <th className="px-4 py-2">Contribución</th>
            </tr>
          </thead>
          <tbody>
            {apoyoPrivado.map((a) => (
              <tr key={a.organizacion} className="border-t border-slate-200">
                <td className="px-4 py-2 font-medium whitespace-nowrap">{a.organizacion}</td>
                <td className="px-4 py-2 text-slate-700">{a.aporte}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500 mt-6">
        ¿Tu empresa quiere sumarse? Escríbenos a través del formulario de{" "}
        <a href="/voluntariado" className="underline hover:text-red-700">voluntariado</a>.
      </p>
    </div>
  );
}
