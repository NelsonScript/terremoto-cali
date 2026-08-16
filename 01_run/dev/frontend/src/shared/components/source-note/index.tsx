import type { FC } from 'react';
import { formatFecha } from '@shared/utils/formato';

export const SourceNote: FC<{ fuente: string; corte: string }> = ({ fuente, corte }) => {
  return (
    <p className="nota" style={{ marginTop: 8 }}>
      Fuente: {fuente} · Corte: {formatFecha(corte)}
    </p>
  );
};
