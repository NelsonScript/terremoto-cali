import { NoticiaClipEstado } from '../noticia-clip-estado.enum';
import { NoticiaClipState } from './noticia-clip-state.interface';
import { TransicionInvalidaException } from '../exceptions/transicion-invalida.exception';

/** PUBLICADA: estado final positivo. No admite ninguna transición. */
export class PublicadaState implements NoticiaClipState {
  readonly estado = NoticiaClipEstado.PUBLICADA;

  aprobar(): void {
    throw new TransicionInvalidaException(this.estado, 'aprobar');
  }

  descartar(): void {
    throw new TransicionInvalidaException(this.estado, 'descartar');
  }

  publicar(): void {
    throw new TransicionInvalidaException(this.estado, 'publicar');
  }
}
