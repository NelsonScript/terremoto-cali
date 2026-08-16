import type { FC } from 'react';
import type { EstadoSemantico } from '@shared/components/estado-badge/estado-badge.types';

const LABELS: Record<EstadoSemantico, string> = {
  critico: 'CRÍTICO',
  'en-evaluacion': 'EN EVAL.',
  'sin-datos': 'SIN DATO',
};

const CLASES: Record<EstadoSemantico, string> = {
  critico: 'critico',
  'en-evaluacion': 'evaluacion',
  'sin-datos': 'sin-dato',
};

export const EstadoBadge: FC<{ estado: EstadoSemantico }> = ({ estado }) => {
  return <span className={`etiqueta ${CLASES[estado]}`}>{LABELS[estado]}</span>;
};
