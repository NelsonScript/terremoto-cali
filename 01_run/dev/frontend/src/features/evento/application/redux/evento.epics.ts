import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ofType, type Epic } from 'redux-observable';
import { fetchResumenRequest, fetchResumenSuccess, fetchResumenFailure } from '@features/evento/application/redux/evento.actions';
import { eventoContainer } from '@features/evento/application/container/evento.ioc';
import { EventoUseCases } from '@features/evento/application/usecases/evento.usecases';
import { EVENTO_IOC_TYPES } from '@features/evento/application/container/evento.ioc.types';
import { fromTaskEither } from '@shared/core/error/from-task-either';

const eventoUseCases = eventoContainer.get<EventoUseCases>(EVENTO_IOC_TYPES.EventoUseCases);

export const fetchResumenEpic: Epic = (action$) =>
  action$.pipe(
    ofType(fetchResumenRequest.type),
    switchMap(() =>
      fromTaskEither(eventoUseCases.obtenerResumenNacional()).pipe(
        map((resumen) => fetchResumenSuccess(resumen)),
        catchError((error) => of(fetchResumenFailure(error)))
      )
    )
  );
