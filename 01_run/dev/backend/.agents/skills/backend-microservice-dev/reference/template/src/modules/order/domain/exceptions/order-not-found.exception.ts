import { DomainException } from './domain.exception';

/**
 * Se lanza cuando se intenta operar sobre un Order que no existe.
 */
export class OrderNotFoundException extends DomainException {
  readonly errorCode = 'ORDER_NOT_FOUND';
  readonly httpStatusHint = 404;

  constructor(orderId: string) {
    super(`El pedido con id "${orderId}" no existe.`);
  }
}
