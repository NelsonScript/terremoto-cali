import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { departamentosContainer } from '@features/departamentos/application/container/departamentos.ioc';
import { DEPARTAMENTOS_IOC_TYPES } from '@features/departamentos/application/container/departamentos.ioc.types';
import { DepartamentosUseCases } from '@features/departamentos/application/usecases/departamentos.usecases';

const departamentosUseCases = departamentosContainer.get<DepartamentosUseCases>(DEPARTAMENTOS_IOC_TYPES.DepartamentosUseCases);

const BORDE: Record<string, string> = {
  'Albergue temporal': 'var(--operativo)',
  'Punto de acopio': 'var(--tinta)',
};

export const Albergues: FC = () => {
  const items = departamentosUseCases.listarAlberguesYAcopio();
  const departamentosPrioritarios = departamentosUseCases.listarPrioritarios();

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
            <Link key={d.id} to={`/departamentos/${d.id}`} style={{ border: '1px solid var(--linea-2)', padding: '8px 12px', fontSize: 15, textDecoration: 'none' }}>
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
            <article key={`${a.tipo}-${a.nombre}`} style={{ border: '1px solid var(--linea-2)', borderTop: `4px solid ${BORDE[a.tipo]}`, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <h2>{a.nombre}</h2>
                <span className={`etiqueta ${a.tipo === 'Albergue temporal' ? 'operativo' : 'sin-dato'}`}>
                  {a.tipo === 'Albergue temporal' ? 'ALBERGUE' : 'ACOPIO'}
                </span>
              </div>
              <div style={{ fontSize: 15, marginTop: 4 }}>{a.departamento}</div>
            </article>
          ))
        )}
      </section>
    </main>
  );
};
