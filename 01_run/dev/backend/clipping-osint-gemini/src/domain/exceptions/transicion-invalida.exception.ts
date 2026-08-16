import { DomainException } from './domain.exception';
import { NoticiaClipEstado } from '../noticia-clip-estado.enum';

/**
 * Se lanza cuando se intenta una transición no permitida en la máquina de
 * estados de NoticiaClip (ej. publicar una noticia que ya fue descartada).
 */
export class TransicionInvalidaException extends DomainException {
  readonly errorCode = 'NOTICIA_CLIP_TRANSICION_INVALIDA';

  constructor(estadoActual: NoticiaClipEstado, accionIntentada: string) {
    super(
      `No se puede ejecutar la acción "${accionIntentada}" estando la noticia en estado "${estadoActual}".`,
    );
  }
}
