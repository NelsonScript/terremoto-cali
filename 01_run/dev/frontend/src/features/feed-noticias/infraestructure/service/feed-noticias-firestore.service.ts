import { injectable } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getDb } from '@shared/core/persistence/firebase';
import type { FeedNoticiasRepository } from '@features/feed-noticias/domain/feed-noticias.repository';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';
import { RawNoticiaClipSchema } from '@features/feed-noticias/domain/schemas/noticia-clip.schema';
import { mapearNoticiaClip } from '@features/feed-noticias/domain/services/mapear-noticia-clip.service';
import { FeedNoticiasFirestoreServiceException } from '@features/feed-noticias/infraestructure/service/feed-noticias-firestore.service.exception';

const LIMITE_RESULTADOS = 60;

/**
 * Implementación de `FeedNoticiasRepository` sobre Firestore — primera vez en
 * el proyecto que se LEE una colección completa (varios documentos) en vez
 * de un solo doc (`evento`, que además es JSON local) o de escribir uno
 * (`reportes`/`voluntariado`). Protegida por reglas de lectura pública +
 * creación validada por esquema (ver `firestore.rules`); quien escribe es el
 * agente de clipping OSINT, no un formulario de este cliente — por eso cada
 * documento se revalida con zod acá también (ver
 * `domain/schemas/noticia-clip.schema.ts`), igual que se haría con la
 * respuesta de un API de un tercero real.
 */
@injectable()
export class FeedNoticiasFirestoreService implements FeedNoticiasRepository {
  obtenerRecientes(): TE.TaskEither<FeedNoticiasFirestoreServiceException, NoticiaClip[]> {
    return TE.tryCatch(
      async () => {
        const consulta = query(
          collection(getDb(), 'feed_noticias'),
          orderBy('fechaPublicacion', 'desc'),
          limit(LIMITE_RESULTADOS)
        );
        const snapshot = await getDocs(consulta);
        const noticias: NoticiaClip[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const validado = RawNoticiaClipSchema.safeParse(data);
          if (!validado.success) {
            console.warn(`[FeedNoticias] Documento ${doc.id} descartado por esquema inválido:`, validado.error.format(), data);
            continue;
          }
          noticias.push(mapearNoticiaClip(doc.id, validado.data));
        }
        return noticias;
      },
      (error) => new FeedNoticiasFirestoreServiceException(this.obtenerRecientes.name, error)
    );
  }
}
