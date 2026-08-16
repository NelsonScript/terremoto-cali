import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ofType, type Epic } from 'redux-observable';
import {
  fetchSismosRequest,
  fetchSismosSuccess,
  fetchSismosFailure,
} from '@features/sismicidad/application/redux/sismicidad.actions';
import { sismicidadContainer } from '@features/sismicidad/application/container/sismicidad.ioc';
import { SISMICIDAD_IOC_TYPES } from '@features/sismicidad/application/container/sismicidad.ioc.types';
import { SismicidadUseCases } from '@features/sismicidad/application/usecases/sismicidad.usecases';
import { fromTaskEither } from '@shared/core/error/from-task-either';

const sismicidadUseCases = sismicidadContainer.get<SismicidadUseCases>(SISMICIDAD_IOC_TYPES.SismicidadUseCases);

export const fetchSismosEpic: Epic = (action$) =>
  action$.pipe(
    ofType(fetchSismosRequest.type),
    switchMap(() =>
      fromTaskEither(sismicidadUseCases.obtenerRecientes()).pipe(
        map((sismos) => fetchSismosSuccess(sismos)),
        catchError((error) => of(fetchSismosFailure(error)))
      )
    )
  );
