import type { Metadata } from "next";
import DepartamentosTable from "@/components/DepartamentosTable";
import { departamentosPrioritarios, departamentosSecundarios } from "@/lib/data";

export const metadata: Metadata = {
  title: "Departamentos afectados",
};

export default function DepartamentosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Departamentos afectados</h1>
      <p className="text-slate-600 mb-6 max-w-2xl">
        Cada departamento vive un momento distinto de la emergencia. Elige el
        tuyo para ver su situación, municipios y necesidades específicas.
      </p>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Con diagnóstico detallado por municipio
      </h2>
      <div className="mb-8">
        <DepartamentosTable departamentos={departamentosPrioritarios} />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Afectación menor — solo cifras agregadas (UNGRD)
      </h2>
      <DepartamentosTable departamentos={departamentosSecundarios} />
    </div>
  );
}
