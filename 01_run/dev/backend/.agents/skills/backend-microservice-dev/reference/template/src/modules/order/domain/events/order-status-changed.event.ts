import { OrderStatus } from '../order-status.enum';

/**
 * Evento de dominio: se emite en CADA transición exitosa de la máquina de
 * estados del Order (Created -> Processing -> Approved/Cancelled).
 */
export class OrderStatusChangedEvent {
  constructor(
    readonly orderId: string,
    readonly previousStatus: OrderStatus,
    readonly newStatus: OrderStatus,
    readonly occurredAt: Date,
  ) {}
}
