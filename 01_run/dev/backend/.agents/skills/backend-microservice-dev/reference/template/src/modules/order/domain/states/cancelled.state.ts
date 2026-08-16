import { OrderStatus } from '../order-status.enum';
import { OrderState } from './order-state.interface';
import { InvalidOrderStateTransitionException } from '../exceptions/invalid-order-state-transition.exception';

/**
 * Estado CANCELLED: estado final negativo. No admite ninguna transición.
 */
export class CancelledState implements OrderState {
  readonly status = OrderStatus.CANCELLED;

  process(): void {
    throw new InvalidOrderStateTransitionException(this.status, 'process');
  }

  approve(): void {
    throw new InvalidOrderStateTransitionException(this.status, 'approve');
  }

  cancel(): void {
    throw new InvalidOrderStateTransitionException(this.status, 'cancel');
  }
}
