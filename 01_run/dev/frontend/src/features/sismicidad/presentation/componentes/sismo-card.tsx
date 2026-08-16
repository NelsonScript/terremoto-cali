import type { FC } from 'react';
import { formatTiempoRelativo } from '@shared/utils/formato';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';

const BORDE: Record<string, string> = {
  critico: 'var(--critico)',
  evaluacion: 'var(--evaluacion)',
  'sin-dato': 'var(--tinta)',
};

function claseMagnitud(magnitud: number): 'critico' | 'evaluacion' | 'sin-dato' {
  if (magnitud >= 6) return 'critico';
  if (magnitud >= 4.5) return 'evaluacion';
  return 'sin-dato';
}

export const SismoCard: FC<{ sismo: Sismo }> = ({ sismo }) => {
  const clase = claseMagnitud(sismo.magnitud);

  return (
    <article style={{ border: '1px solid var(--linea-2)', borderTop: `4px solid ${BORDE[clase]}`, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <span className="cifra" style={{ fontSize: 28, fontWeight: 700 }}>M {sismo.magnitud.toFixed(1)}</span>
          <span className="nota" style={{ marginLeft: 8 }}>{sismo.magnitudTipo}</span>
        </div>
        <span className={`etiqueta ${clase}`}>{formatTiempoRelativo(sismo.fechaHora)}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6 }}>{sismo.lugar}</div>
      <div className="nota" style={{ marginTop: 4 }}>
        Profundidad: {sismo.profundidadKm.toFixed(0)} km
        {sismo.sentidoReportes != null && <> · {sismo.sentidoReportes} reportes "lo sentí"</>}
        {sismo.alerta && <> · Alerta PAGER: {sismo.alerta.toUpperCase()}</>}
      </div>
      <p className="nota" style={{ marginTop: 6 }}>
        <a href={sismo.urlDetalle} target="_blank" rel="noopener noreferrer">Ver detalle en USGS →</a>
      </p>
    </article>
  );
};
