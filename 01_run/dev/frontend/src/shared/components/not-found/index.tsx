import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const NotFound: FC = () => {
  return (
    <main className="contenedor" style={{ paddingTop: 32 }}>
      <h1>Página no encontrada</h1>
      <p className="sub">La ruta que buscas no existe o cambió.</p>
      <p style={{ marginTop: 16 }}>
        <Link to="/" style={{ fontWeight: 600 }}>
          Volver al inicio →
        </Link>
      </p>
    </main>
  );
};
