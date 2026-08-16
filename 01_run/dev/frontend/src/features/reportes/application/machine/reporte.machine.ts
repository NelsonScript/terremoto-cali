import { createStateMachine, type StateMachineConfig } from '@shared/core/state-machine/create-state-machine';

export type ReporteEstado = 'idle' | 'enviando' | 'exito' | 'error';
export type ReporteEvento = 'ENVIAR' | 'EXITO' | 'FALLO' | 'REINICIAR';

/**
 * Máquina de estados del caso de uso "enviar reporte" — vive en Application
 * porque orquesta el flujo del caso de uso, no es una regla de Domain ni un
 * detalle de UI. El slice de Redux persiste `current`; el componente de
 * Presentación solo lee ese valor, nunca decide transiciones por su cuenta.
 */
const reporteMachineConfig: StateMachineConfig<ReporteEstado, ReporteEvento> = {
  initial: 'idle',
  transitions: {
    idle: { ENVIAR: 'enviando' },
    enviando: { EXITO: 'exito', FALLO: 'error' },
    exito: { REINICIAR: 'idle' },
    error: { ENVIAR: 'enviando', REINICIAR: 'idle' },
  },
};

export const createReporteMachine = (current?: ReporteEstado) => createStateMachine(reporteMachineConfig, current);
