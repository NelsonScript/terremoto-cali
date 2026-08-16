import type { FC } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@config/state-managment/store';
import { Render } from '@shared/components/render';
import { formatTiempoRelativo } from '@shared/utils/formato';
import { fetchSismosRequest } from '@features/sismicidad/application/redux/sismicidad.actions';
import { selectSismicidad } from '@features/sismicidad/application/redux/sismicidad.selectors';
import { SismicidadActionTypes } from '@features/sismicidad/application/redux/sismicidad.action-types';
import { SismoCard } from '@features/sismicidad/presentation/componentes/sismo-card';

/** El USGS no publica actualizaciones instantáneas por push — se refresca por sondeo periódico. */
const INTERVALO_ACTUALIZACION_MS = 5 * 60 * 1000;

const SismicidadContenido: FC<{ actualizando: boolean }> = ({ actualizando }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, ultimaActualizacion } = useSelector(selectSismicidad);

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Actividad sísmica reciente</h1>
        <p className="sub">
          Últimos {data.length} sismos de magnitud 2.5+ detectados en la región (últimos 30 días), vía el servicio
          público del USGS (Servicio Geológico de EE. UU.). Se actualiza sola cada 5 minutos.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
          {actualizando ? (
            <span className="nota">Actualizando…</span>
          ) : (
            ultimaActualizacion && <span className="nota">Última actualización: {formatTiempoRelativo(ultimaActualizacion)}</span>
          )}
          <button type="button" className="boton" disabled={actualizando} onClick={() => dispatch(fetchSismosRequest())}>
            Actualizar ahora
          </button>
        </div>
        <p className="nota" style={{ marginTop: 10, border: '1px solid var(--evaluacion)', background: 'var(--evaluacion-suave)', color: 'var(--tinta)', padding: 10 }}>
          Esta sección solo cubre sismicidad (magnitud, ubicación, réplicas) — no reemplaza los reportes oficiales
          de UNGRD sobre fallecidos, heridos o viviendas afectadas, que se actualizan por boletín en la sección de
          <a href="/departamentos"> Departamentos</a>. No se encontró un API público del Servicio Geológico
          Colombiano (SGC) para integrarlo directamente; esta sección usa el USGS como fuente en vivo confiable.
        </p>
      </div>

      <section className="seccion pila">
        {data.length === 0 ? (
          <p className="sub">No se registraron sismos de magnitud 2.5+ en los últimos 30 días.</p>
        ) : (
          data.map((sismo) => <SismoCard key={sismo.id} sismo={sismo} />)
        )}
      </section>
    </main>
  );
};

export const Sismicidad: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error, ultimaActualizacion } = useSelector(selectSismicidad);
  const cargando = status === SismicidadActionTypes.FETCH_SISMOS_LOADING;
  // Solo se muestra pantalla completa de carga la primera vez (sin datos aún);
  // los refrescos periódicos posteriores no deben tapar la lista ya visible.
  const esPrimeraCarga = cargando && ultimaActualizacion === null;

  useEffect(() => {
    dispatch(fetchSismosRequest());
    const intervalo = setInterval(() => dispatch(fetchSismosRequest()), INTERVALO_ACTUALIZACION_MS);
    return () => clearInterval(intervalo);
  }, [dispatch]);

  return (
    <Render
      isLoading={esPrimeraCarga}
      error={error}
      SuccessComponent={() => <SismicidadContenido actualizando={cargando && !esPrimeraCarga} />}
    />
  );
};
