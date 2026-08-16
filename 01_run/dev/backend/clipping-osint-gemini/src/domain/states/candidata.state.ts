import type { NoticiaClip } from '../noticia-clip.entity';
import { NoticiaClipEstado } from '../noticia-clip-estado.enum';
import { NoticiaClipState } from './noticia-clip-state.interface';
import { TransicionInvalidaException } from '../exceptions/transicion-invalida.exception';
import { VerificadaState } from './verificada.state';
import { DescartadaState } from './descartada.state';

/** CANDIDATA: recién extraída y validada contra el esquema + invariantes. */
export class CandidataState implements NoticiaClipState {
  readonly estado = NoticiaClipEstado.CANDIDATA;

  aprobar(noticia: NoticiaClip): void {
    noticia.transicionarA(NoticiaClipEstado.VERIFICADA, new VerificadaState());
  }

  descartar(noticia: NoticiaClip, motivos: string[]): void {
    noticia.transicionarA(NoticiaClipEstado.DESCARTADA, new DescartadaState(), { motivos });
  }

  publicar(): void {
    throw new TransicionInvalidaException(this.estado, 'publicar');
  }
}
