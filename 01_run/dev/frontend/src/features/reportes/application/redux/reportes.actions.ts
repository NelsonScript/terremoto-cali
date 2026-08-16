import { createAction } from '@reduxjs/toolkit';

export const enviarReporteRequest = createAction<Record<string, unknown>>('reportes/enviarRequest');
export const enviarReporteSuccess = createAction('reportes/enviarSuccess');
export const enviarReporteFailure = createAction<string>('reportes/enviarFailure');
export const reiniciarReporte = createAction('reportes/reiniciar');

export type EnviarReporteRequestAction = ReturnType<typeof enviarReporteRequest>;
