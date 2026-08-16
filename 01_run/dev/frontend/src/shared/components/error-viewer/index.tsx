import type { FC } from 'react';

export interface ErrorViewerProps {
  error: Error;
}

/** Componente dumb — muestra un error ya ocurrido, no decide cuándo mostrarse. */
export const ErrorViewer: FC<ErrorViewerProps> = ({ error }) => {
  return (
    <div
      role="alert"
      style={{
        borderLeft: '5px solid var(--critico)',
        background: 'var(--critico-suave)',
        padding: 14,
        margin: '16px 0',
      }}
    >
      <div style={{ fontWeight: 700, color: 'var(--critico)' }}>{error.name || 'Error'}</div>
      <div style={{ fontSize: 15, marginTop: 4 }}>{error.message}</div>
    </div>
  );
};
