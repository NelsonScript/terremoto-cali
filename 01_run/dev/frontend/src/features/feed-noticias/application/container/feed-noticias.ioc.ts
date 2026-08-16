import { Container } from 'inversify';
import { FEED_NOTICIAS_IOC_TYPES } from '@features/feed-noticias/application/container/feed-noticias.ioc.types';
import type { FeedNoticiasRepository } from '@features/feed-noticias/domain/feed-noticias.repository';
import { FeedNoticiasFirestoreService } from '@features/feed-noticias/infraestructure/service/feed-noticias-firestore.service';
import { FeedNoticiasUseCases } from '@features/feed-noticias/application/usecases/feed-noticias.usecases';

const container = new Container();

container.bind<FeedNoticiasRepository>(FEED_NOTICIAS_IOC_TYPES.FeedNoticiasRepository).to(FeedNoticiasFirestoreService);
container.bind<FeedNoticiasUseCases>(FEED_NOTICIAS_IOC_TYPES.FeedNoticiasUseCases).to(FeedNoticiasUseCases);

export { container as feedNoticiasContainer };
