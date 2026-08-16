import { DomainException } from './domain.exception';

/**
 * Se lanza cuando una candidata, aunque cumple el esquema zod, viola una
 * invariante de negocio (ej. departamento fuera de los cubiertos por el
 * sitio).
 */
export class DatosInvalidosException extends DomainException {
  readonly errorCode = 'NOTICIA_CLIP_DATOS_INVALIDOS';

  constructor(message: string) {
    super(message);
  }
}
