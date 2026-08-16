import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@config/state-managment/store';
import { Render } from '@shared/components/render';
import { formatTiempoRelativo } from '@shared/utils/formato';
import { fetchNoticiasRequest } from '@features/feed-noticias/application/redux/feed-noticias.actions';
import { selectFeedNoticias } from '@features/feed-noticias/application/redux/feed-noticias.selectors';
import { FeedNoticiasActionTypes } from '@features/feed-noticias/application/redux/feed-noticias.action-types';
import { NoticiaCard } from '@features/feed-noticias/presentation/componentes/noticia-card';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';

/** El agente OSINT publica cada 4h — sondear cada 10 min es más que suficiente y barato. */
const INTERVALO_ACTUALIZACION_MS = 10 * 60 * 1000;

const FILTROS: Array<{ valor: NoticiaClip['categoria'] | 'todas'; texto: string }> = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'fallecidos', texto: 'Fallecidos' },
  { valor: 'heridos', texto: 'Heridos' },
  { valor: 'albergues', texto: 'Albergues' },
  { valor: 'infraestructura', texto: 'Infraestructura' },
  { valor: 'ayuda-humanitaria', texto: 'Ayuda humanitaria' },
  { valor: 'vias-comunicacion', texto: 'Vías y comunicación' },
  { valor: 'salud', texto: 'Salud' },
];

const FeedNoticiasContenido: FC<{ actualizando: boolean }> = ({ actualizando }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, ultimaActualizacion } = useSelector(selectFeedNoticias);
  const [filtro, setFiltro] = useState<NoticiaClip['categoria'] | 'todas'>('todas');

  const noticiasFiltradas = useMemo(
    () => (filtro === 'todas' ? data : data.filter((n) => n.categoria === filtro)),
    [data, filtro]
  );

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Feed de noticias — recopilado de prensa</h1>
        <p className="sub">
          {data.length} notas recopiladas automáticamente mediante un agente de clipping (búsqueda + verificación
          cruzada tipo OSINT) sobre medios y cuentas oficiales confiables. Se actualiza sola cada 4 horas.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
          {actualizando ? (
            <span className="nota">Actualizando…</span>
          ) : (
            ultimaActualizacion && <span className="nota">Última actualización: {formatTiempoRelativo(ultimaActualizacion)}</span>
          )}
          <button type="button" className="boton" disabled={actualizando} onClick={() => dispatch(fetchNoticiasRequest())}>
            Actualizar ahora
          </button>
        </div>
        <p
          className="nota"
          style={{
            marginTop: 10,
            border: '1px solid var(--evaluacion)',
            background: 'var(--evaluacion-suave)',
            color: 'var(--tinta)',
            padding: 10,
          }}
        >
          <strong>Esto NO es una fuente oficial.</strong> Son notas de prensa y cuentas públicas, recopiladas y
          etiquetadas automáticamente — cada una indica su fuente y si fue corroborada por más de un medio. Para
          cifras oficiales de fallecidos/heridos/viviendas por departamento, ver <a href="/departamentos">Departamentos</a>
          {' '}(boletines UNGRD).
        </p>
        <div className="fila-chips" style={{ marginTop: 10 }}>
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              className={`etiqueta ${filtro === f.valor ? 'operativo' : 'sin-dato'}`}
              style={{ border: 'none', cursor: 'pointer' }}
              onClick={() => setFiltro(f.valor)}
            >
              {f.texto}
            </button>
          ))}
        </div>
      </div>

      <section className="seccion pila">
        {noticiasFiltradas.length === 0 ? (
          <p className="sub">No hay noticias recopiladas todavía para este filtro.</p>
        ) : (
          noticiasFiltradas.map((noticia) => <NoticiaCard key={noticia.id} noticia={noticia} />)
        )}
      </section>
    </main>
  );
};

export const FeedNoticias: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, ultimaActualizacion } = useSelector(selectFeedNoticias);
  const cargando = status === FeedNoticiasActionTypes.FETCH_NOTICIAS_LOADING;
  // Solo se muestra pantalla completa de carga la primera vez (sin datos aún);
  // los refrescos periódicos posteriores no deben tapar la lista ya visible.
  const esPrimeraCarga = cargando && ultimaActualizacion === null;

  useEffect(() => {
    dispatch(fetchNoticiasRequest());
    const intervalo = setInterval(() => dispatch(fetchNoticiasRequest()), INTERVALO_ACTUALIZACION_MS);
    return () => clearInterval(intervalo);
  }, [dispatch]);

  return (
    <Render
      isLoading={esPrimeraCarga}
      error={error}
      SuccessComponent={() => <FeedNoticiasContenido actualizando={cargando && !esPrimeraCarga} />}
    />
  );
};
