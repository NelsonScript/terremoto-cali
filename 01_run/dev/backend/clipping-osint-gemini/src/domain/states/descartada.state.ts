import { NoticiaClipEstado } from '../noticia-clip-estado.enum';
import { NoticiaClipState } from './noticia-clip-state.interface';
import { TransicionInvalidaException } from '../exceptions/transicion-invalida.exception';

/** DESCARTADA: estado final negativo. No admite ninguna transición. */
export class DescartadaState implements NoticiaClipState {
  readonly estado = NoticiaClipEstado.DESCARTADA;

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
