import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ProcessOrderCommand } from './process-order.command';
import { IOrderRepository, ORDER_REPOSITORY } from '../../../domain/order.repository';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';

@CommandHandler(ProcessOrderCommand)
export class ProcessOrderHandler implements ICommandHandler<ProcessOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ProcessOrderCommand): Promise<void> {
    const existingOrder = await this.orderRepository.findById(command.orderId);
    if (!existingOrder) {
      throw new OrderNotFoundException(command.orderId);
    }

    const order = this.eventPublisher.mergeObjectContext(existingOrder);

    // Regla de negocio + transición de estado + evento de dominio: todo
    // vive dentro de la entidad (order.process()), el handler solo orquesta.
    order.process();

    await this.orderRepository.save(order);
    order.commit();
  }
}
