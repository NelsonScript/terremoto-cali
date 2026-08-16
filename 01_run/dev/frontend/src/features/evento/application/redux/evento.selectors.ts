import type { RootState } from '@config/state-managment/store';
import { EventoActionTypes } from '@features/evento/application/redux/evento.action-types';

export const selectEvento = (state: RootState) => state.evento;
export const selectEventoIsLoading = (state: RootState) => state.evento.status === EventoActionTypes.FETCH_RESUMEN_LOADING;
