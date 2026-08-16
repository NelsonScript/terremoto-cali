import type { FC } from 'react';
import { departamentosContainer } from '@features/departamentos/application/container/departamentos.ioc';
import { DEPARTAMENTOS_IOC_TYPES } from '@features/departamentos/application/container/departamentos.ioc.types';
import { DepartamentosUseCases } from '@features/departamentos/application/usecases/departamentos.usecases';
import { DepartamentosTable } from '@features/departamentos/presentation/componentes/departamentos-table';

const useCases = departamentosContainer.get<DepartamentosUseCases>(DEPARTAMENTOS_IOC_TYPES.DepartamentosUseCases);

export const DepartamentosList: FC = () => {
  const prioritarios = useCases.listarPrioritarios();
  const secundarios = useCases.listarSecundarios();

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
        <DepartamentosTable departamentos={prioritarios} />
      </section>

      <section className="seccion">
        <h2 className="rotulo">Afectación menor — solo cifras agregadas (UNGRD)</h2>
        <DepartamentosTable departamentos={secundarios} />
      </section>
    </main>
  );
};
