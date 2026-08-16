import { DomainException } from './domain.exception';
import { OrderStatus } from '../order-status.enum';

/**
 * Se lanza cuando la máquina de estados del Order detecta una transición
 * no permitida (ej: aprobar un pedido ya cancelado).
 */
export class InvalidOrderStateTransitionException extends DomainException {
  readonly errorCode = 'ORDER_INVALID_STATE_TRANSITION';
  readonly httpStatusHint = 400; // Bad Request / Conflicto de negocio

  constructor(
    readonly currentStatus: OrderStatus | string,
    readonly attemptedAction: string,
  ) {
    super(
      `No se puede ejecutar la acción "${attemptedAction}" estando el pedido en estado "${currentStatus}".`,
    );
  }
}
