import { createSlice } from '@reduxjs/toolkit';
import {
  fetchSismosRequest,
  fetchSismosSuccess,
  fetchSismosFailure,
} from '@features/sismicidad/application/redux/sismicidad.actions';
import { SismicidadActionTypes } from '@features/sismicidad/application/redux/sismicidad.action-types';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';

interface SismicidadState {
  data: Sismo[];
  status: SismicidadActionTypes;
  error: Error | null;
  ultimaActualizacion: string | null;
}

const initialState: SismicidadState = {
  data: [],
  status: SismicidadActionTypes.FETCH_SISMOS_LOADING,
  error: null,
  ultimaActualizacion: null,
};

const sismicidadSlice = createSlice({
  name: 'sismicidad',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSismosRequest, (state) => {
        state.status = SismicidadActionTypes.FETCH_SISMOS_LOADING;
        state.error = null;
      })
      .addCase(fetchSismosSuccess, (state, action) => {
        state.status = SismicidadActionTypes.FETCH_SISMOS_SUCCESS;
        state.data = action.payload;
        state.ultimaActualizacion = new Date().toISOString();
      })
      .addCase(fetchSismosFailure, (state, action) => {
        state.status = SismicidadActionTypes.FETCH_SISMOS_FAILURE;
        state.error = action.payload;
      });
  },
});

export default sismicidadSlice.reducer;
