import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ApproveOrderCommand } from './approve-order.command';
import { IOrderRepository, ORDER_REPOSITORY } from '../../../domain/order.repository';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';

@CommandHandler(ApproveOrderCommand)
export class ApproveOrderHandler implements ICommandHandler<ApproveOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ApproveOrderCommand): Promise<void> {
    const existingOrder = await this.orderRepository.findById(command.orderId);
    if (!existingOrder) {
      throw new OrderNotFoundException(command.orderId);
    }

    const order = this.eventPublisher.mergeObjectContext(existingOrder);

    order.approve();

    await this.orderRepository.save(order);
    order.commit();
  }
}
