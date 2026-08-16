import { createAction } from '@reduxjs/toolkit';
import { EventoActionTypes } from '@features/evento/application/redux/evento.action-types';
import type { ResumenEventoModel } from '@features/evento/domain/models/resumen-evento.model';

export const fetchResumenRequest = createAction(EventoActionTypes.FETCH_RESUMEN_LOADING);
export const fetchResumenSuccess = createAction<ResumenEventoModel>(EventoActionTypes.FETCH_RESUMEN_SUCCESS);
export const fetchResumenFailure = createAction<Error>(EventoActionTypes.FETCH_RESUMEN_FAILURE);
