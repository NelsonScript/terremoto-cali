import Link from "next/link";
import EstadoBadge from "@/components/EstadoBadge";
import { getEstadoDepartamento, formatNumero } from "@/lib/data";
import type { Departamento } from "@/lib/types";

export default function DepartamentosTable({ departamentos }: { departamentos: Departamento[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Departamento</th>
          <th style={{ textAlign: "right" }}>Fallecidos</th>
          <th>Situación</th>
          <th style={{ textAlign: "right" }}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {departamentos.map((d) => {
          const fallecidos = d.cifras_capital?.fallecidos ?? d.cifras_departamento_ungrd.fallecidos;
          const estado = getEstadoDepartamento(d);
          return (
            <tr key={d.id}>
              <td>
                <Link href={`/departamentos/${d.id}`} style={{ fontWeight: 700, fontSize: 17, textDecoration: "none" }}>
                  {d.nombre}
                </Link>
                <div className="nota">Capital: {d.capital}</div>
              </td>
              <td className="cifra" style={{ textAlign: "right", fontSize: 22, fontWeight: 700 }}>
                {formatNumero(fallecidos)}
              </td>
              <td style={{ fontSize: 15 }}>{d.resumen}</td>
              <td style={{ textAlign: "right" }}>
                <EstadoBadge estado={estado} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
