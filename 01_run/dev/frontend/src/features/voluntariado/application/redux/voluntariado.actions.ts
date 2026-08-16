import { createAction } from '@reduxjs/toolkit';

export const registrarVoluntarioRequest = createAction<Record<string, unknown>>('voluntariado/registrarRequest');
export const registrarVoluntarioSuccess = createAction('voluntariado/registrarSuccess');
export const registrarVoluntarioFailure = createAction<string>('voluntariado/registrarFailure');
export const reiniciarVoluntario = createAction('voluntariado/reiniciar');

export type RegistrarVoluntarioRequestAction = ReturnType<typeof registrarVoluntarioRequest>;
