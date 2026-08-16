import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedEvent } from '../../../domain/events/order-created.event';

/**
 * Reacciona de forma asíncrona y desacoplada a la creación de un pedido.
 * En un caso real aquí se podría, por ejemplo, publicar un mensaje en un
 * broker (Kafka/RabbitMQ) para otros microservicios, o disparar un
 * proceso de reserva de inventario.
 */
@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  private readonly logger = new Logger(OrderCreatedHandler.name);

  async handle(event: OrderCreatedEvent): Promise<void> {
    this.logger.log(
      `[OrderCreated] orderId=${event.orderId} customerId=${event.customerId} amount=${event.amount}`,
    );

    // Simulación de efecto secundario desacoplado (p. ej. notificación).
    await this.simulateNotification(event);
  }

  private async simulateNotification(event: OrderCreatedEvent): Promise<void> {
    this.logger.log(
      `[Notificación] Se notificó al cliente ${event.customerId} que su pedido ${event.orderId} fue creado.`,
    );
  }
}
