import type { Firestore } from 'firebase-admin/firestore';
import type { IFeedNoticiasRepository, NoticiaExistente } from '../../domain/feed-noticias.repository';
import type { NoticiaClip } from '../../domain/noticia-clip.entity';

/**
 * Implementación concreta del puerto `IFeedNoticiasRepository` contra
 * Firestore. Mismo comportamiento que el script original: lee las 12
 * últimas por `fechaPublicacion` desc, y al guardar agrega
 * `fechaRecopilacion` + `creadoPor`.
 */
export class FirestoreFeedNoticiasRepository implements IFeedNoticiasRepository {
  constructor(
    private readonly db: Firestore,
    private readonly coleccion: string,
  ) {}

  async buscarUltimas(limite: number): Promise<NoticiaExistente[]> {
    const snap = await this.db.collection(this.coleccion).orderBy('fechaPublicacion', 'desc').limit(limite).get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as NoticiaExistente[];
  }

  async guardar(noticia: NoticiaClip): Promise<string> {
    const ref = await this.db.collection(this.coleccion).add({
      ...noticia.datosParaPersistir,
      fechaRecopilacion: new Date().toISOString(),
      creadoPor: 'agente-clipping-osint-gemini-gcp',
    });
    return ref.id;
  }
}
