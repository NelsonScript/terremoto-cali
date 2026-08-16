import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatFecha, formatNumero } from '@shared/utils/formato';
import { useResumenEvento } from '@features/evento/presentation/hooks/use-resumen-evento';

const NAV_LINKS = [
  { href: '/departamentos', label: 'Departamentos' },
  { href: '/salud', label: 'Salud' },
  { href: '/albergues', label: 'Albergues' },
  { href: '/sismicidad', label: 'Sismicidad' },
  { href: '/noticias', label: 'Noticias' },
  { href: '/voluntariado', label: 'Voluntariado' },
  { href: '/tramites', label: 'Trámites' },
  { href: '/apoyo-privado', label: 'Apoyo privado' },
  { href: '/fuentes', label: 'Fuentes' },
  { href: '/donar', label: 'Donar', variant: 'donar' },
  { href: '/lineas-de-emergencia', label: 'Llamar', variant: 'llamar' },
];

/** Puerto fiel de EncabezadoPagina.js (referencia de diseño). */
export const SiteHeader: FC = () => {
  const { pathname } = useLocation();
  const { data } = useResumenEvento();
  const esHome = pathname === '/';
  const meta = data?.meta;
  const titular = meta
    ? `${meta.evento} — epicentro ${meta.epicentro} — ${formatNumero(meta.nacional.fallecidos_gobernaciones.valor)} fallecidos a nivel nacional (cifra preliminar, en aumento)`
    : null;

  return (
    <>
      <div className="barra-marca">
        <div className="contenedor">
          {esHome ? (
            <span style={{ fontWeight: 700, letterSpacing: '.04em' }}>
              AYUDA SUROCCIDENTE · ESTADO NACIONAL
            </span>
          ) : (
            <Link to="/">← Inicio</Link>
          )}
          <span className="ruta">{esHome ? (meta ? 'Corte ' + formatFecha(meta.ultima_actualizacion) : '') : pathname}</span>
        </div>
      </div>
      {esHome && titular && (
        <div className="tira-evento">
          <div className="contenedor">{titular}</div>
        </div>
      )}
      <div className="contenedor" style={{ padding: '10px 16px' }}>
        <nav className="nav-escritorio" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} to={l.href} className={l.variant}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};
