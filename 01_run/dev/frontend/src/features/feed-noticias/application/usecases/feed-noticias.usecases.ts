import { injectable, inject } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FEED_NOTICIAS_IOC_TYPES } from '@features/feed-noticias/application/container/feed-noticias.ioc.types';
import type { FeedNoticiasRepository } from '@features/feed-noticias/domain/feed-noticias.repository';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';
import { FeedNoticiasUseCasesException } from '@features/feed-noticias/application/usecases/feed-noticias.usecases.exception';

@injectable()
export class FeedNoticiasUseCases {
  constructor(
    @inject(FEED_NOTICIAS_IOC_TYPES.FeedNoticiasRepository) private readonly repository: FeedNoticiasRepository
  ) {}

  /** Noticias recopiladas por el agente OSINT, más reciente primero. */
  obtenerRecientes(): TE.TaskEither<FeedNoticiasUseCasesException, NoticiaClip[]> {
    return pipe(
      this.repository.obtenerRecientes(),
      TE.mapLeft((error) => new FeedNoticiasUseCasesException(this.obtenerRecientes.name, error))
    );
  }
}
