import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderStatusChangedEvent } from '../../../domain/events/order-status-changed.event';

/**
 * Reacciona a CADA transición de estado del pedido. Desacoplado del
 * Command Handler que originó el cambio: el dominio solo declara "esto
 * ocurrió", y este handler decide qué hacer al respecto.
 */
@EventsHandler(OrderStatusChangedEvent)
export class OrderStatusChangedHandler implements IEventHandler<OrderStatusChangedEvent> {
  private readonly logger = new Logger(OrderStatusChangedHandler.name);

  async handle(event: OrderStatusChangedEvent): Promise<void> {
    this.logger.log(
      `[OrderStatusChanged] orderId=${event.orderId} ${event.previousStatus} -> ${event.newStatus}`,
    );

    await this.simulateNotification(event);
  }

  private async simulateNotification(event: OrderStatusChangedEvent): Promise<void> {
    this.logger.log(
      `[Notificación] Pedido ${event.orderId} cambió a estado ${event.newStatus}.`,
    );
  }
}
