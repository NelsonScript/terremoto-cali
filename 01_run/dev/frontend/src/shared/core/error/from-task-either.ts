import { Observable } from 'rxjs';
import type { TaskEither } from 'fp-ts/TaskEither';
import { fold as foldEither } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

/**
 * Puente entre fp-ts TaskEither (usado en Domain/Application/Infraestructure
 * para tipar operaciones que pueden fallar) y RxJS Observable (usado por los
 * epics de redux-observable). Portado 1:1 del patrón de referencia (vired3).
 */
export const fromTaskEither = <E, A>(taskEither: TaskEither<E, A>): Observable<A> =>
  new Observable<A>((observer) => {
    taskEither().then((either) => {
      pipe(
        either,
        foldEither(
          (error: E) => observer.error(error),
          (value: A) => {
            observer.next(value);
            observer.complete();
          }
        )
      );
    }).catch((err) => observer.error(err));
  });
