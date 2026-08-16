import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQuery } from './get-orders.query';
import {
  IOrderReadRepository,
  ORDER_READ_REPOSITORY,
  PaginatedResult,
} from '../../ports/order-read.repository';
import { OrderReadModel } from '../../read-models/order-read-model';

@QueryHandler(GetOrdersQuery)
export class GetOrdersHandler implements IQueryHandler<GetOrdersQuery> {
  constructor(
    @Inject(ORDER_READ_REPOSITORY)
    private readonly orderReadRepository: IOrderReadRepository,
  ) {}

  async execute(query: GetOrdersQuery): Promise<PaginatedResult<OrderReadModel>> {
    return this.orderReadRepository.findAll({
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }
}
