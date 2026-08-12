import Link from "next/link";
import type { Metadata } from "next";
import { getAlberguesYAcopio, departamentosPrioritarios } from "@/lib/data";

export const metadata: Metadata = {
  title: "Albergues y puntos de acopio",
};

const BORDE: Record<string, string> = {
  "Albergue temporal": "var(--operativo)",
  "Punto de acopio": "var(--tinta)",
};

export default function AlberguesPage() {
  const items = getAlberguesYAcopio();

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Albergues y puntos de acopio</h1>
        <p className="sub">
          Directorio de sitios habilitados para alojar a familias damnificadas y recibir donaciones. Se irá
          ampliando por departamento a medida que se habiliten nuevos puntos.
        </p>
        <nav className="fila-chips" style={{ marginTop: 12 }} aria-label="Ir a un departamento">
          {departamentosPrioritarios.map((d) => (
            <Link key={d.id} href={`/departamentos/${d.id}`} style={{ border: "1px solid var(--linea-2)", padding: "8px 12px", fontSize: 15, textDecoration: "none" }}>
              {d.nombre}
            </Link>
          ))}
        </nav>
      </div>

      <section className="seccion pila">
        {items.length === 0 ? (
          <p className="sub">Aún no hay puntos registrados.</p>
        ) : (
          items.map((a) => (
            <article key={`${a.tipo}-${a.nombre}`} style={{ border: "1px solid var(--linea-2)", borderTop: `4px solid ${BORDE[a.tipo]}`, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <h2>{a.nombre}</h2>
                <span className={`etiqueta ${a.tipo === "Albergue temporal" ? "operativo" : "sin-dato"}`}>
                  {a.tipo === "Albergue temporal" ? "ALBERGUE" : "ACOPIO"}
                </span>
              </div>
              <div style={{ fontSize: 15, marginTop: 4 }}>{a.departamento}</div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
