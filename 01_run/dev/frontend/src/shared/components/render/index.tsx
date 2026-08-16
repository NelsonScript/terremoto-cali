import type { ComponentType, FC } from 'react';
import { Loading } from '@shared/components/loading';
import { ErrorViewer } from '@shared/components/error-viewer';

export interface RenderProps {
  isLoading: boolean;
  error: Error | null;
  SuccessComponent: ComponentType;
}

/**
 * Componente dumb compartido por toda la capa de Presentación: decide entre
 * loading/error/éxito a partir del estado que ya resolvió Redux — nunca
 * decide él mismo si algo está cargando.
 */
export const Render: FC<RenderProps> = ({ isLoading, error, SuccessComponent }) => {
  if (isLoading) return <Loading />;
  if (error) return <ErrorViewer error={error} />;
  return <SuccessComponent />;
};
