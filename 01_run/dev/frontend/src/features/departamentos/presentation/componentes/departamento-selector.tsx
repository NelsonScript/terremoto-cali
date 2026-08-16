import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Departamento } from '@features/departamentos/domain/entities/departamento';

export const DepartamentoSelector: FC<{ departamentos: Departamento[]; activo: string }> = ({ departamentos, activo }) => {
  return (
    <nav className="fila-chips" aria-label="Seleccionar departamento">
      {departamentos.map((d) =>
        d.id === activo ? (
          <span key={d.id} style={{ background: 'var(--tinta)', color: '#fff', padding: '8px 12px', fontSize: 15, fontWeight: 600 }}>
            {d.nombre}
          </span>
        ) : (
          <Link
            key={d.id}
            to={`/departamentos/${d.id}`}
            style={{ border: '1px solid var(--linea-2)', padding: '8px 12px', fontSize: 15, textDecoration: 'none' }}
          >
            {d.nombre}
          </Link>
        )
      )}
    </nav>
  );
};
