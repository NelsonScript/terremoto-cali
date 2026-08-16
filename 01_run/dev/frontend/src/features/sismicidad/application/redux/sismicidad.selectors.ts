import type { RootState } from '@config/state-managment/store';
import { SismicidadActionTypes } from '@features/sismicidad/application/redux/sismicidad.action-types';

export const selectSismicidad = (state: RootState) => state.sismicidad;
export const selectSismicidadIsLoading = (state: RootState) =>
  state.sismicidad.status === SismicidadActionTypes.FETCH_SISMOS_LOADING;
