import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import {
  IOrderReadRepository,
  ORDER_READ_REPOSITORY,
} from '../../ports/order-read.repository';
import { OrderReadModel } from '../../read-models/order-read-model';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';

/**
 * Query Handler de lectura rápida: consulta directamente el modelo de
 * lectura (proyección) sin reconstruir el agregado `Order`.
 */
@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdHandler implements IQueryHandler<GetOrderByIdQuery> {
  constructor(
    @Inject(ORDER_READ_REPOSITORY)
    private readonly orderReadRepository: IOrderReadRepository,
  ) {}

  async execute(query: GetOrderByIdQuery): Promise<OrderReadModel> {
    const order = await this.orderReadRepository.findById(query.orderId);
    if (!order) {
      throw new OrderNotFoundException(query.orderId);
    }
    return order;
  }
}
