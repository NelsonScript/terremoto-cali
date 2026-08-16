import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ofType, type Epic } from 'redux-observable';
import {
  registrarVoluntarioRequest,
  registrarVoluntarioSuccess,
  registrarVoluntarioFailure,
  type RegistrarVoluntarioRequestAction,
} from '@features/voluntariado/application/redux/voluntariado.actions';
import { voluntariadoContainer } from '@features/voluntariado/application/container/voluntariado.ioc';
import { VOLUNTARIADO_IOC_TYPES } from '@features/voluntariado/application/container/voluntariado.ioc.types';
import { VoluntariadoUseCases } from '@features/voluntariado/application/usecases/voluntariado.usecases';
import { fromTaskEither } from '@shared/core/error/from-task-either';

const voluntariadoUseCases = voluntariadoContainer.get<VoluntariadoUseCases>(VOLUNTARIADO_IOC_TYPES.VoluntariadoUseCases);

export const registrarVoluntarioEpic: Epic = (action$) =>
  action$.pipe(
    ofType(registrarVoluntarioRequest.type),
    switchMap((action: RegistrarVoluntarioRequestAction) =>
      fromTaskEither(voluntariadoUseCases.registrarVoluntario(action.payload)).pipe(
        map(() => registrarVoluntarioSuccess()),
        catchError((error) => of(registrarVoluntarioFailure(error instanceof Error ? error.message : String(error))))
      )
    )
  );
