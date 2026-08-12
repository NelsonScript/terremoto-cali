import type { Metadata } from "next";
import { apoyoPrivado } from "@/lib/data";
import type { ApoyoPrivado } from "@/lib/types";

export const metadata: Metadata = {
  title: "Apoyo externo y del sector privado",
};

function Grupo({ tipo, items }: { tipo: string; items: ApoyoPrivado[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">{tipo}</h2>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <tbody>
            {items.map((a) => (
              <tr key={a.organizacion} className="border-t border-slate-200 first:border-t-0">
                <td className="px-4 py-2 font-medium whitespace-nowrap align-top">{a.organizacion}</td>
                <td className="px-4 py-2 text-slate-700">{a.aporte}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ApoyoPrivadoPage() {
  const internacional = apoyoPrivado.filter((a) => a.tipo === "Cooperación internacional");
  const privado = apoyoPrivado.filter((a) => a.tipo === "Sector privado");
  const interinstitucional = apoyoPrivado.filter((a) => a.tipo === "Cooperación interinstitucional");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Apoyo externo y del sector privado</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Países, empresas e instituciones que ya están aportando a la
        respuesta. Reconocerlos también sirve para que más se sumen.
      </p>

      <Grupo tipo="Cooperación internacional" items={internacional} />
      <Grupo tipo="Sector privado" items={privado} />
      <Grupo tipo="Cooperación interinstitucional" items={interinstitucional} />

      <p className="text-sm text-slate-500 mt-2">
        ¿Tu empresa u organización quiere sumarse? Escríbenos a través del
        formulario de{" "}
        <a href="/voluntariado" className="underline hover:text-red-700">voluntariado</a>.
      </p>
    </div>
  );
}
