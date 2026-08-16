import { OrderStatus } from '../../../domain/order-status.enum';

export class GetOrdersQuery {
  constructor(
    readonly status?: OrderStatus,
    readonly page: number = 1,
    readonly limit: number = 20,
  ) {}
}
