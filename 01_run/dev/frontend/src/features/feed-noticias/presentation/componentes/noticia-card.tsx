import type { FC } from 'react';
import { formatTiempoRelativo } from '@shared/utils/formato';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';

const ETIQUETA_CATEGORIA: Record<NoticiaClip['categoria'], { texto: string; clase: string }> = {
  fallecidos: { texto: 'Fallecidos', clase: 'critico' },
  heridos: { texto: 'Heridos', clase: 'evaluacion' },
  albergues: { texto: 'Albergues', clase: 'operativo' },
  infraestructura: { texto: 'Infraestructura', clase: 'evaluacion' },
  'ayuda-humanitaria': { texto: 'Ayuda humanitaria', clase: 'operativo' },
  'vias-comunicacion': { texto: 'Vías y comunicación', clase: 'evaluacion' },
  salud: { texto: 'Salud', clase: 'evaluacion' },
  otro: { texto: 'Otro', clase: 'sin-dato' },
};

export const NoticiaCard: FC<{ noticia: NoticiaClip }> = ({ noticia }) => {
  const categoria = ETIQUETA_CATEGORIA[noticia.categoria];
  const corroborado = noticia.corroboracion.nivel === 'multiple-fuentes';

  return (
    <article style={{ border: '1px solid var(--linea-2)', padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="fila-chips">
          <span className={`etiqueta ${categoria.clase}`}>{categoria.texto}</span>
          {noticia.departamento && <span className="etiqueta sin-dato">{noticia.departamento}</span>}
          <span className={`etiqueta ${corroborado ? 'operativo' : 'sin-dato'}`}>
            {corroborado
              ? `Corroborado por ${noticia.corroboracion.fuentesAdicionales.length + 1} fuentes`
              : 'Fuente única, sin corroborar'}
          </span>
        </div>
        <span className="nota">{formatTiempoRelativo(noticia.fechaPublicacion)}</span>
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, margin: '8px 0 4px' }}>{noticia.titular}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.5, margin: 0 }}>{noticia.resumen}</p>

      {noticia.cifras.length > 0 && (
        <div className="fila-chips" style={{ marginTop: 8 }}>
          {noticia.cifras.map((c, i) => (
            <span key={i} className="etiqueta sin-dato">
              {c.etiqueta}: <span className="cifra">{c.valor}</span> {c.unidad}
            </span>
          ))}
        </div>
      )}

      {noticia.notaAmbiguedad && (
        <div
          style={{
            marginTop: 10,
            borderLeft: '5px solid var(--evaluacion)',
            background: 'var(--evaluacion-suave)',
            padding: 10,
            fontSize: 14,
          }}
        >
          <strong>Nota:</strong> {noticia.notaAmbiguedad}
        </div>
      )}

      <p className="nota" style={{ marginTop: 8 }}>
        Fuente: <a href={noticia.fuente.url} target="_blank" rel="noopener noreferrer">{noticia.fuente.nombre}</a>
        {' · '}
        {formatTiempoRelativo(noticia.fechaPublicacion)}
      </p>
    </article>
  );
};
