import Link from "next/link";
import type { Departamento } from "@/lib/types";

/** Puerto fiel de SelectorZona.js (referencia de diseño), adaptado a departamentos. */
export default function DepartamentoSelector({
  departamentos,
  activo,
}: {
  departamentos: Departamento[];
  activo: string;
}) {
  return (
    <nav className="fila-chips" aria-label="Seleccionar departamento">
      {departamentos.map((d) =>
        d.id === activo ? (
          <span key={d.id} style={{ background: "var(--tinta)", color: "#fff", padding: "8px 12px", fontSize: 15, fontWeight: 600 }}>
            {d.nombre}
          </span>
        ) : (
          <Link
            key={d.id}
            href={`/departamentos/${d.id}`}
            style={{ border: "1px solid var(--linea-2)", padding: "8px 12px", fontSize: 15, textDecoration: "none" }}
          >
            {d.nombre}
          </Link>
        )
      )}
    </nav>
  );
}
