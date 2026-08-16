import type { NoticiaClip } from '../noticia-clip.entity';
import { NoticiaClipEstado } from '../noticia-clip-estado.enum';

/**
 * Contrato del patrón State para NoticiaClip. Cada estado concreto decide
 * por sí mismo qué transiciones son válidas desde ahí.
 */
export interface NoticiaClipState {
  readonly estado: NoticiaClipEstado;

  aprobar(noticia: NoticiaClip): void;
  descartar(noticia: NoticiaClip, motivos: string[]): void;
  publicar(noticia: NoticiaClip, idDocumento: string): void;
}
