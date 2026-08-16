import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Render } from '@shared/components/render';
import { AlertBanner } from '@shared/components/alert-banner';
import { useResumenEvento } from '@features/evento/presentation/hooks/use-resumen-evento';
import type { InstitucionSalud } from '@features/evento/domain/entities/evento';

const ETIQUETA: Record<string, [string, string]> = {
  Evacuada: ['critico', 'EVACUADA'],
  Inoperativa: ['critico', 'INOPERATIVA'],
  'Daño grave': ['critico', 'DAÑO GRAVE'],
  'Saturado (100%)': ['evaluacion', 'SATURADO'],
  'En evaluación': ['evaluacion', 'EN EVAL.'],
  'Afectación media': ['evaluacion', 'AFECT. MEDIA'],
  'Afectación técnica': ['evaluacion', 'AFECT. TÉCNICA'],
  'Afectación estructural': ['evaluacion', 'AFECT. ESTRUCT.'],
};

const SaludContenido: FC<{ hospitales: NonNullable<ReturnType<typeof useResumenEvento>['data']>['hospitales'] }> = ({ hospitales }) => {
  const total = hospitales.resumen_por_ciudad.reduce((a, r) => a + r.total, 0);
  const evacuadas = hospitales.resumen_por_ciudad.reduce((a, r) => a + r.dano_grave_evacuadas, 0);
  const enEvaluacion = hospitales.resumen_por_ciudad.reduce((a, r) => a + r.en_evaluacion_saturadas, 0);

  return (
    <main className="contenedor">
      <div className="seccion">
        <h1>Red hospitalaria</h1>
        <p className="sub">{hospitales.fuente}. Corte {new Date(hospitales.corte).toLocaleDateString('es-CO')}.</p>
      </div>

      {hospitales.necesidades_urgentes.length > 0 && (
        <AlertBanner nivel="critico" titulo="Necesidad urgente">
          {hospitales.necesidades_urgentes.map((n, i) => (
            <div key={i}>
              <strong>{n.zona}:</strong> {n.necesidad} — {n.responsable}
            </div>
          ))}
        </AlertBanner>
      )}

      <section className="seccion">
        <table>
          <caption className="nota" style={{ captionSide: 'bottom', textAlign: 'left', paddingTop: 8 }}>
            El listado se publica solo con confirmación oficial; una institución sin dato no aparece como operativa.
          </caption>
          <thead>
            <tr>
              <th>Institución</th>
              <th style={{ textAlign: 'right' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {hospitales.instituciones.map((inst: InstitucionSalud) => {
              const [clase, texto] = ETIQUETA[inst.estado] || ['sin-dato', 'SIN DATO'];
              return (
                <tr key={inst.nombre}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{inst.nombre}</div>
                    <div className="nota">{inst.ciudad} · {inst.detalle}</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`etiqueta ${clase}`}>{texto}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ borderTop: '2px solid var(--tinta)', paddingTop: 10, fontSize: 15 }}>
          <strong>{total} instituciones</strong> de salud afectadas o en evaluación: {evacuadas} evacuadas o con
          daño grave y {enEvaluacion} en evaluación o saturadas.
        </p>
        <p className="nota"><Link to="/fuentes">Metodología</Link></p>
      </section>
    </main>
  );
};

export const Salud: FC = () => {
  const { data, error, isLoading } = useResumenEvento();
  return (
    <Render
      isLoading={isLoading}
      error={error}
      SuccessComponent={() => (data ? <SaludContenido hospitales={data.hospitales} /> : null)}
    />
  );
};
