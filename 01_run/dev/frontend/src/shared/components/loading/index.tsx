import type { FC } from 'react';
import './loading.css';

/** Componente dumb — solo presentación, sin conocimiento del feature que lo usa. */
export const Loading: FC = () => {
  return (
    <div className="loading-spinner" role="status" aria-label="Cargando">
      <div className="spinner" />
    </div>
  );
};
