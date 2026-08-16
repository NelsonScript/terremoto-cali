import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ofType, type Epic } from 'redux-observable';
import {
  fetchNoticiasRequest,
  fetchNoticiasSuccess,
  fetchNoticiasFailure,
} from '@features/feed-noticias/application/redux/feed-noticias.actions';
import { feedNoticiasContainer } from '@features/feed-noticias/application/container/feed-noticias.ioc';
import { FEED_NOTICIAS_IOC_TYPES } from '@features/feed-noticias/application/container/feed-noticias.ioc.types';
import { FeedNoticiasUseCases } from '@features/feed-noticias/application/usecases/feed-noticias.usecases';
import { fromTaskEither } from '@shared/core/error/from-task-either';

const feedNoticiasUseCases = feedNoticiasContainer.get<FeedNoticiasUseCases>(
  FEED_NOTICIAS_IOC_TYPES.FeedNoticiasUseCases
);

export const fetchNoticiasEpic: Epic = (action$) =>
  action$.pipe(
    ofType(fetchNoticiasRequest.type),
    switchMap(() =>
      fromTaskEither(feedNoticiasUseCases.obtenerRecientes()).pipe(
        map((noticias) => fetchNoticiasSuccess(noticias)),
        catchError((error) => of(fetchNoticiasFailure(error)))
      )
    )
  );
