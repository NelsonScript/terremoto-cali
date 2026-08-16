import type { FC } from 'react';

export interface LineaEmergenciaCardProps {
  nombre: string;
  descripcion: string;
  numero: string;
  nivel?: 'critico' | 'neutro';
}

/** Puerto fiel de LineaEmergencia.js (referencia de diseño). */
export const LineaEmergenciaCard: FC<LineaEmergenciaCardProps> = ({ nombre, descripcion, numero, nivel = 'critico' }) => {
  const critico = nivel === 'critico';
  return (
    <a
      href={numero ? 'tel:' + numero : undefined}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        textDecoration: 'none',
        padding: 16,
        minHeight: 64,
        background: critico ? 'var(--critico)' : 'var(--fondo)',
        color: critico ? '#fff' : 'var(--tinta)',
        border: critico ? 'none' : '2px solid var(--tinta)',
      }}
    >
      <span>
        <span style={{ fontSize: 19, fontWeight: 700 }}>{nombre}</span>
        <span style={{ display: 'block', fontSize: 14, color: critico ? 'rgba(255,255,255,.9)' : 'var(--tinta-3)' }}>
          {descripcion}
        </span>
      </span>
      <span className="cifra" style={{ fontSize: 38, fontWeight: 700, lineHeight: 1 }}>
        {numero}
      </span>
    </a>
  );
};
