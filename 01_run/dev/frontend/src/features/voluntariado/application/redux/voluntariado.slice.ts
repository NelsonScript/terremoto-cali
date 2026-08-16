import { createSlice } from '@reduxjs/toolkit';
import {
  registrarVoluntarioRequest,
  registrarVoluntarioSuccess,
  registrarVoluntarioFailure,
  reiniciarVoluntario,
} from '@features/voluntariado/application/redux/voluntariado.actions';
import { createVoluntarioMachine, type VoluntarioEstado } from '@features/voluntariado/application/machine/voluntario.machine';

interface VoluntariadoState {
  estado: VoluntarioEstado;
  error: string | null;
}

const initialState: VoluntariadoState = {
  estado: 'idle',
  error: null,
};

const voluntariadoSlice = createSlice({
  name: 'voluntariado',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registrarVoluntarioRequest, (state) => {
        state.estado = createVoluntarioMachine(state.estado).send('ENVIAR').current;
        state.error = null;
      })
      .addCase(registrarVoluntarioSuccess, (state) => {
        state.estado = createVoluntarioMachine(state.estado).send('EXITO').current;
      })
      .addCase(registrarVoluntarioFailure, (state, action) => {
        state.estado = createVoluntarioMachine(state.estado).send('FALLO').current;
        state.error = action.payload;
      })
      .addCase(reiniciarVoluntario, (state) => {
        state.estado = createVoluntarioMachine(state.estado).send('REINICIAR').current;
        state.error = null;
      });
  },
});

export default voluntariadoSlice.reducer;
