import { createSlice } from '@reduxjs/toolkit';
import { fetchResumenRequest, fetchResumenSuccess, fetchResumenFailure } from '@features/evento/application/redux/evento.actions';
import { EventoActionTypes } from '@features/evento/application/redux/evento.action-types';
import type { ResumenEventoModel } from '@features/evento/domain/models/resumen-evento.model';

interface EventoState {
  data: ResumenEventoModel | null;
  status: EventoActionTypes;
  error: Error | null;
}

const initialState: EventoState = {
  data: null,
  status: EventoActionTypes.FETCH_RESUMEN_LOADING,
  error: null,
};

const eventoSlice = createSlice({
  name: 'evento',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumenRequest, (state) => {
        state.status = EventoActionTypes.FETCH_RESUMEN_LOADING;
        state.error = null;
      })
      .addCase(fetchResumenSuccess, (state, action) => {
        state.status = EventoActionTypes.FETCH_RESUMEN_SUCCESS;
        state.data = action.payload;
      })
      .addCase(fetchResumenFailure, (state, action) => {
        state.status = EventoActionTypes.FETCH_RESUMEN_FAILURE;
        state.error = action.payload;
      });
  },
});

export default eventoSlice.reducer;
