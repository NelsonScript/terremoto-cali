import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ofType, type Epic } from 'redux-observable';
import {
  enviarReporteRequest,
  enviarReporteSuccess,
  enviarReporteFailure,
  type EnviarReporteRequestAction,
} from '@features/reportes/application/redux/reportes.actions';
import { reportesContainer } from '@features/reportes/application/container/reportes.ioc';
import { REPORTES_IOC_TYPES } from '@features/reportes/application/container/reportes.ioc.types';
import { ReportesUseCases } from '@features/reportes/application/usecases/reportes.usecases';
import { fromTaskEither } from '@shared/core/error/from-task-either';

const reportesUseCases = reportesContainer.get<ReportesUseCases>(REPORTES_IOC_TYPES.ReportesUseCases);

export const enviarReporteEpic: Epic = (action$) =>
  action$.pipe(
    ofType(enviarReporteRequest.type),
    switchMap((action: EnviarReporteRequestAction) =>
      fromTaskEither(reportesUseCases.enviarReporte(action.payload)).pipe(
        map(() => enviarReporteSuccess()),
        catchError((error) => of(enviarReporteFailure(error instanceof Error ? error.message : String(error))))
      )
    )
  );
