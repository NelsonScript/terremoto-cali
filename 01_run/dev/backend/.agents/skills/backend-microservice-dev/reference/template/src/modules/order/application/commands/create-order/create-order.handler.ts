import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { Order } from '../../../domain/order.entity';
import { IOrderRepository, ORDER_REPOSITORY } from '../../../domain/order.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateOrderCommand): Promise<{ id: string }> {
    const { orderId, customerId, amount } = command;

    // 1. Se crea el agregado (aquí ya se aplica OrderCreatedEvent).
    const order = this.eventPublisher.mergeObjectContext(
      Order.create({ id: orderId, customerId, amount }),
    );

    // 2. Se persiste el nuevo estado a través del contrato del repositorio.
    await this.orderRepository.save(order);

    // 3. Se publican los eventos de dominio acumulados en el agregado.
    order.commit();

    return { id: order.id };
  }
}
