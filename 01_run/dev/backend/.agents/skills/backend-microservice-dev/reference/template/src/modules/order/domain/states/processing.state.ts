import type { Order } from '../order.entity';
import { OrderStatus } from '../order-status.enum';
import { OrderState } from './order-state.interface';
import { InvalidOrderStateTransitionException } from '../exceptions/invalid-order-state-transition.exception';

/**
 * Estado PROCESSING: el pedido está en trámite.
 * Desde aquí se puede aprobar o cancelar, pero no volver a "procesar".
 */
export class ProcessingState implements OrderState {
  readonly status = OrderStatus.PROCESSING;

  process(): void {
    throw new InvalidOrderStateTransitionException(this.status, 'process');
  }

  approve(order: Order): void {
    order.setStatus(OrderStatus.APPROVED);
  }

  cancel(order: Order): void {
    order.setStatus(OrderStatus.CANCELLED);
  }
}
