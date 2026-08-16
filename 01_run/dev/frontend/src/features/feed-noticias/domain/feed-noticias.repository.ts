import type * as TE from 'fp-ts/TaskEither';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';
import type { FeedNoticiasFirestoreServiceException } from '@features/feed-noticias/infraestructure/service/feed-noticias-firestore.service.exception';

/**
 * Contrato del bounded context "feed-noticias": recopilación de prensa NO
 * oficial sobre la emergencia, alimentada por el agente de clipping OSINT.
 * Es un contexto propio, no una extensión de `evento` (cifras oficiales
 * consolidadas manualmente) ni de `sismicidad` (una sola fuente externa de
 * datos estructurados) — acá la fuente son artículos de prensa heterogéneos,
 * ya reducidos a la forma `NoticiaClip` por el agente antes de escribirse.
 */
export interface FeedNoticiasRepository {
  obtenerRecientes(): TE.TaskEither<FeedNoticiasFirestoreServiceException, NoticiaClip[]>;
}
