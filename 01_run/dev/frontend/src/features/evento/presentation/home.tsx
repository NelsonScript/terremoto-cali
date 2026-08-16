import type { FC } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@config/state-managment/store';
import { Render } from '@shared/components/render';
import { AlertBanner } from '@shared/components/alert-banner';
import { LineaEmergenciaCard } from '@shared/components/linea-emergencia-card';
import { EstadoBadge } from '@shared/components/estado-badge';
import { formatNumero } from '@shared/utils/formato';
import { fetchResumenRequest } from '@features/evento/application/redux/evento.actions';
import { selectEvento } from '@features/evento/application/redux/evento.selectors';
import { EventoActionTypes } from '@features/evento/application/redux/evento.action-types';
import { departamentosContainer } from '@features/departamentos/application/container/departamentos.ioc';
import { DEPARTAMENTOS_IOC_TYPES } from '@features/departamentos/application/container/departamentos.ioc.types';
import { DepartamentosUseCases } from '@features/departamentos/application/usecases/departamentos.usecases';

const departamentosUseCases = departamentosContainer.get<DepartamentosUseCases>(DEPARTAMENTOS_IOC_TYPES.DepartamentosUseCases);

const HomeContenido: FC = () => {
  const { data } = useSelector(selectEvento);
  if (!data) return null;
  const { meta, hospitales, lineas } = data;

  const todos = departamentosUseCases.listarTodos();

  const resumenHospitalario = hospitales.resumen_por_ciudad.reduce(
    (acc, r) => ({
      evacuadas: acc.evacuadas + r.dano_grave_evacuadas,
      enEvaluacion: acc.enEvaluacion + r.en_evaluacion_saturadas,
      total: acc.total + r.total,
    }),
    { evacuadas: 0, enEvaluacion: 0, total: 0 }
  );

  const necesidadesUrgentes = Array.from(
    new Set(departamentosUseCases.listarPrioritarios().flatMap((d) => d.necesidades))
  ).slice(0, 8);

  const bomberos = lineas.find((l) => l.numero === '119');
  const policia = lineas.find((l) => l.numero === '123');

  return (
    <main className="contenedor">
      <div className="rejilla-principal seccion">
        <div>
          <h2 className="rotulo">Situación por departamento</h2>
          <table>
            <caption className="nota" style={{ captionSide: 'bottom', textAlign: 'left', paddingTop: 8 }}>
              Fuente: {meta.nacional.fallecidos_gobernaciones.fuente} y Asocapitales. «—» = sin dato confirmado por
              fuente oficial. <Link to="/fuentes">Metodología y fuentes</Link>
            </caption>
            <thead>
              <tr>
                <th>Departamento</th>
                <th style={{ textAlign: 'right' }}>Fallecidos</th>
                <th style={{ textAlign: 'right' }}>Heridos</th>
                <th style={{ textAlign: 'right' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((d) => {
                const fallecidos = d.cifras_capital?.fallecidos ?? d.cifras_departamento_ungrd.fallecidos;
                const heridos = d.cifras_capital?.heridos ?? d.cifras_departamento_ungrd.heridos;
                const estado = departamentosUseCases.estadoDe(d);
                return (
                  <tr key={d.id}>
                    <td>
                      <Link to={`/departamentos/${d.id}`} style={{ fontWeight: 700, fontSize: 17, textDecoration: 'none' }}>
                        {d.nombre}
                      </Link>
                      <div className="nota">{d.resumen}</div>
                    </td>
                    <td className="cifra" style={{ textAlign: 'right', fontSize: 24, fontWeight: 700, color: fallecidos != null ? undefined : 'var(--gris)' }}>
                      {formatNumero(fallecidos)}
                    </td>
                    <td className="cifra" style={{ textAlign: 'right', fontSize: 24, fontWeight: 700, color: heridos != null ? undefined : 'var(--gris)' }}>
                      {formatNumero(heridos)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <EstadoBadge estado={estado} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2 className="rotulo" style={{ marginTop: 24 }}>Red hospitalaria</h2>
          <div className="rejilla-2" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            <div style={{ borderLeft: '6px solid var(--critico)', background: 'var(--fondo-2)', padding: '12px 14px' }}>
              <div className="cifra" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{resumenHospitalario.evacuadas}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>Evacuadas o con daño grave</div>
            </div>
            <div style={{ borderLeft: '6px solid var(--evaluacion)', background: 'var(--fondo-2)', padding: '12px 14px' }}>
              <div className="cifra" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{resumenHospitalario.enEvaluacion}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>En evaluación o saturadas</div>
            </div>
            <div style={{ borderLeft: '6px solid var(--tinta)', background: 'var(--fondo-2)', padding: '12px 14px' }}>
              <div className="cifra" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1 }}>{resumenHospitalario.total}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>Total afectadas o en evaluación</div>
            </div>
          </div>
          <p className="nota">
            {hospitales.fuente}, corte {new Date(hospitales.corte).toLocaleDateString('es-CO')}.{' '}
            <Link to="/salud">Ver tabla por institución</Link>
          </p>
        </div>

        <aside>
          <AlertBanner nivel="critico" titulo="Cuidado con las estafas">
            Toda ayuda en dinero se canaliza <strong>únicamente</strong> por la Cruz Roja Colombiana. Ninguna otra
            cuenta está autorizada.{' '}
            <Link to="/donar" style={{ color: '#fff' }}>
              Cómo verificar antes de transferir
            </Link>
          </AlertBanner>

          <h2 className="rotulo" style={{ marginTop: 20 }}>Necesidades más urgentes hoy</h2>
          <div className="fila-chips">
            {necesidadesUrgentes.map((n) => (
              <span key={n} style={{ border: '1px solid var(--tinta)', padding: '8px 12px', fontSize: 15, fontWeight: 600 }}>
                {n}
              </span>
            ))}
          </div>

          <h2 className="rotulo" style={{ marginTop: 20 }}>Líneas de emergencia</h2>
          <div className="pila">
            {bomberos && <LineaEmergenciaCard nombre="Bomberos" descripcion="Rescate y colapsos" numero={bomberos.numero} nivel="critico" />}
            {policia && <LineaEmergenciaCard nombre="Policía" descripcion="Emergencias generales" numero={policia.numero} nivel="neutro" />}
          </div>
        </aside>
      </div>
    </main>
  );
};

export const Home: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector(selectEvento);

  useEffect(() => {
    dispatch(fetchResumenRequest());
  }, [dispatch]);

  return <Render isLoading={status === EventoActionTypes.FETCH_RESUMEN_LOADING} error={error} SuccessComponent={HomeContenido} />;
};
