import { DomainException } from './domain.exception';

/**
 * Se lanza cuando se intenta construir un Order con datos que violan
 * invariantes de negocio (ej: monto negativo).
 */
export class InvalidOrderDataException extends DomainException {
  readonly errorCode = 'ORDER_INVALID_DATA';
  readonly httpStatusHint = 400;

  constructor(message: string) {
    super(message);
  }
}
