import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useResumenEvento } from '@features/evento/presentation/hooks/use-resumen-evento';

/** Puerto fiel de PieSitio.js (referencia de diseño). */
export const SiteFooter: FC = () => {
  const { data } = useResumenEvento();
  const nombresFuentes = (data?.fuentes ?? []).map((f) => f.nombre);

  return (
    <footer className="pie">
      <div className="contenedor">
        <span>
          {nombresFuentes.length > 0 && <>Fuentes: {nombresFuentes.join(' · ')}.<br /></>}
          Sitio de utilidad pública sin ánimo de lucro. No sustituye a las entidades oficiales.
        </span>
        <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link to="/departamentos">Departamentos</Link>
          <Link to="/salud">Salud</Link>
          <Link to="/sismicidad">Sismicidad</Link>
          <Link to="/noticias">Noticias</Link>
          <Link to="/fuentes">Fuentes</Link>
          <Link to="/voluntariado">Voluntariado</Link>
          <Link to="/tramites">Trámites</Link>
          <Link to="/apoyo-privado">Apoyo privado</Link>
        </span>
      </div>
    </footer>
  );
};
