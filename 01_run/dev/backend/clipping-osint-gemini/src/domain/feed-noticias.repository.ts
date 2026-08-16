import type { NoticiaClip } from './noticia-clip.entity';

/**
 * Representa un documento ya existente en el feed (para deduplicar y
 * fijar la ventana de búsqueda). Es un tipo de lectura mínima, no la
 * entidad completa.
 */
export interface NoticiaExistente {
  id: string;
  titular?: string;
  fechaPublicacion?: string;
  fuente?: { url?: string };
}

/**
 * Puerto (contrato) del repositorio del feed de noticias. Vive en el
 * dominio; la implementación concreta (Firestore) vive en infraestructura.
 */
export interface IFeedNoticiasRepository {
  buscarUltimas(limite: number): Promise<NoticiaExistente[]>;

  /** Persiste la noticia (ya aprobada) y devuelve el id del documento creado. */
  guardar(noticia: NoticiaClip): Promise<string>;
}
