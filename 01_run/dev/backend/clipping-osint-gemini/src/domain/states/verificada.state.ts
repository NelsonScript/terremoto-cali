import type { NoticiaClip } from '../noticia-clip.entity';
import { NoticiaClipEstado } from '../noticia-clip-estado.enum';
import { NoticiaClipState } from './noticia-clip-state.interface';
import { TransicionInvalidaException } from '../exceptions/transicion-invalida.exception';
import { PublicadaState } from './publicada.state';

/** VERIFICADA: pasó deduplicación, lista para persistirse. */
export class VerificadaState implements NoticiaClipState {
  readonly estado = NoticiaClipEstado.VERIFICADA;

  aprobar(): void {
    throw new TransicionInvalidaException(this.estado, 'aprobar');
  }

  descartar(): void {
    throw new TransicionInvalidaException(this.estado, 'descartar');
  }

  publicar(noticia: NoticiaClip, idDocumento: string): void {
    noticia.transicionarA(NoticiaClipEstado.PUBLICADA, new PublicadaState(), { idDocumento });
  }
}
