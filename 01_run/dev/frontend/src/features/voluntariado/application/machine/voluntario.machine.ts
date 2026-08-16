import { createStateMachine, type StateMachineConfig } from '@shared/core/state-machine/create-state-machine';

export type VoluntarioEstado = 'idle' | 'enviando' | 'exito' | 'error';
export type VoluntarioEvento = 'ENVIAR' | 'EXITO' | 'FALLO' | 'REINICIAR';

const voluntarioMachineConfig: StateMachineConfig<VoluntarioEstado, VoluntarioEvento> = {
  initial: 'idle',
  transitions: {
    idle: { ENVIAR: 'enviando' },
    enviando: { EXITO: 'exito', FALLO: 'error' },
    exito: { REINICIAR: 'idle' },
    error: { ENVIAR: 'enviando', REINICIAR: 'idle' },
  },
};

export const createVoluntarioMachine = (current?: VoluntarioEstado) => createStateMachine(voluntarioMachineConfig, current);
