import type { Order } from '../order.entity';
import { OrderStatus } from '../order-status.enum';
import { OrderState } from './order-state.interface';
import { InvalidOrderStateTransitionException } from '../exceptions/invalid-order-state-transition.exception';

/**
 * Estado CREATED: transición inicial del pedido.
 * Desde aquí solo se permite pasar a PROCESSING o cancelar directamente.
 */
export class CreatedState implements OrderState {
  readonly status = OrderStatus.CREATED;

  process(order: Order): void {
    order.setStatus(OrderStatus.PROCESSING);
  }

  approve(): void {
    throw new InvalidOrderStateTransitionException(this.status, 'approve');
  }

  cancel(order: Order): void {
    order.setStatus(OrderStatus.CANCELLED);
  }
}
