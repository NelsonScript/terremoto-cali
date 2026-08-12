import type { Metadata } from "next";
import DepartamentosTable from "@/components/DepartamentosTable";
import { departamentosPrioritarios, departamentosSecundarios } from "@/lib/data";

export const metadata: Metadata = {
  title: "Departamentos afectados",
};

export default function DepartamentosPage() {
  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Departamentos afectados</h1>
        <p className="sub">
          Cada departamento vive un momento distinto de la emergencia. Elige el tuyo para ver su situación,
          municipios y necesidades específicas.
        </p>
      </div>

      <section className="seccion">
        <h2 className="rotulo">Con diagnóstico detallado por municipio</h2>
        <DepartamentosTable departamentos={departamentosPrioritarios} />
      </section>

      <section className="seccion">
        <h2 className="rotulo">Afectación menor — solo cifras agregadas (UNGRD)</h2>
        <DepartamentosTable departamentos={departamentosSecundarios} />
      </section>
    </main>
  );
}
