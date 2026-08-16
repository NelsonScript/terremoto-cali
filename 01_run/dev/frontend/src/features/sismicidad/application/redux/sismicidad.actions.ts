import { createAction } from '@reduxjs/toolkit';
import { SismicidadActionTypes } from '@features/sismicidad/application/redux/sismicidad.action-types';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';

export const fetchSismosRequest = createAction(SismicidadActionTypes.FETCH_SISMOS_LOADING);
export const fetchSismosSuccess = createAction<Sismo[]>(SismicidadActionTypes.FETCH_SISMOS_SUCCESS);
export const fetchSismosFailure = createAction<Error>(SismicidadActionTypes.FETCH_SISMOS_FAILURE);
