import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CancelOrderCommand } from './cancel-order.command';
import { IOrderRepository, ORDER_REPOSITORY } from '../../../domain/order.repository';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const existingOrder = await this.orderRepository.findById(command.orderId);
    if (!existingOrder) {
      throw new OrderNotFoundException(command.orderId);
    }

    const order = this.eventPublisher.mergeObjectContext(existingOrder);

    order.cancel();

    await this.orderRepository.save(order);
    order.commit();
  }
}
