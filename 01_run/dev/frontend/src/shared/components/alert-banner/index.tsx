import type { FC, ReactNode, CSSProperties } from 'react';

const ESTILOS: Record<string, CSSProperties> = {
  critico: { background: 'var(--critico)', color: '#fff', border: 'none' },
  aviso: { background: 'var(--evaluacion-suave)', color: 'var(--tinta-2)', border: '2px solid var(--evaluacion)' },
  resuelto: { background: 'var(--fondo)', color: 'var(--tinta-2)', borderLeft: '5px solid var(--operativo)' },
};

export interface AlertBannerProps {
  nivel?: 'critico' | 'aviso' | 'resuelto';
  titulo?: string;
  children: ReactNode;
}

/** Puerto fiel de BannerAlerta.js (referencia de diseño). Componente dumb, sin lógica de feature. */
export const AlertBanner: FC<AlertBannerProps> = ({ nivel = 'critico', titulo, children }) => {
  return (
    <div
      role={nivel === 'critico' ? 'alert' : undefined}
      style={{ padding: 16, fontSize: 15, lineHeight: 1.5, ...ESTILOS[nivel] }}
    >
      {titulo && <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{titulo}</div>}
      {children}
    </div>
  );
};
