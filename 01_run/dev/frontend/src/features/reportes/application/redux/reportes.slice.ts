import { createSlice } from '@reduxjs/toolkit';
import {
  enviarReporteRequest,
  enviarReporteSuccess,
  enviarReporteFailure,
  reiniciarReporte,
} from '@features/reportes/application/redux/reportes.actions';
import { createReporteMachine, type ReporteEstado } from '@features/reportes/application/machine/reporte.machine';

interface ReportesState {
  estado: ReporteEstado;
  error: string | null;
}

const initialState: ReportesState = {
  estado: 'idle',
  error: null,
};

const reportesSlice = createSlice({
  name: 'reportes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enviarReporteRequest, (state) => {
        state.estado = createReporteMachine(state.estado).send('ENVIAR').current;
        state.error = null;
      })
      .addCase(enviarReporteSuccess, (state) => {
        state.estado = createReporteMachine(state.estado).send('EXITO').current;
      })
      .addCase(enviarReporteFailure, (state, action) => {
        state.estado = createReporteMachine(state.estado).send('FALLO').current;
        state.error = action.payload;
      })
      .addCase(reiniciarReporte, (state) => {
        state.estado = createReporteMachine(state.estado).send('REINICIAR').current;
        state.error = null;
      });
  },
});

export default reportesSlice.reducer;
