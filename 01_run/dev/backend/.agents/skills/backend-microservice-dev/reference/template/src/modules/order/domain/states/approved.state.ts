import { OrderStatus } from '../order-status.enum';
import { OrderState } from './order-state.interface';
import { InvalidOrderStateTransitionException } from '../exceptions/invalid-order-state-transition.exception';

/**
 * Estado APPROVED: estado final positivo. No admite ninguna transición.
 */
export class ApprovedState implements OrderState {
  readonly status = OrderStatus.APPROVED;

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
