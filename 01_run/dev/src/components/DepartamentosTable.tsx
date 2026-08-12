import Link from "next/link";
import EstadoBadge from "@/components/EstadoBadge";
import { getEstadoDepartamento, formatNumero } from "@/lib/data";
import type { Departamento } from "@/lib/types";

export default function DepartamentosTable({ departamentos }: { departamentos: Departamento[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-4 py-2">Departamento</th>
            <th className="px-4 py-2 text-right">Fallecidos</th>
            <th className="px-4 py-2">Situación</th>
            <th className="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.map((d) => {
            const fallecidos = d.cifras_capital?.fallecidos ?? d.cifras_departamento_ungrd.fallecidos;
            const estado = getEstadoDepartamento(d);
            return (
              <tr key={d.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/departamentos/${d.id}`} className="font-semibold text-slate-900 hover:text-red-700 hover:underline">
                    {d.nombre}
                  </Link>
                  <div className="text-xs text-slate-400">Capital: {d.capital}</div>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatNumero(fallecidos)}</td>
                <td className="px-4 py-3 text-slate-600 max-w-xs">{d.resumen}</td>
                <td className="px-4 py-3"><EstadoBadge estado={estado} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
