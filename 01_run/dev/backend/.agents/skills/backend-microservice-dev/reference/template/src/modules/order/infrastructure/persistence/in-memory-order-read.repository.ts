import { Injectable } from '@nestjs/common';
import {
  FindOrdersFilter,
  IOrderReadRepository,
  PaginatedResult,
} from '../../application/ports/order-read.repository';
import { OrderReadModel } from '../../application/read-models/order-read-model';
import { OrderInMemoryDatabase } from './order-in-memory.database';

/**
 * Implementación concreta del puerto `IOrderReadRepository` (lado de
 * lectura del CQRS).
 *
 * A propósito NO pasa por `Order.fromPrimitives`: lee directamente los
 * datos planos y arma el Read Model, simulando una consulta optimizada
 * (ej. una vista SQL desnormalizada o una réplica de solo lectura) que
 * evita el costo de reconstruir el agregado de dominio.
 */
@Injectable()
export class InMemoryOrderReadRepository implements IOrderReadRepository {
  constructor(private readonly database: OrderInMemoryDatabase) {}

  async findById(id: string): Promise<OrderReadModel | null> {
    const record = this.database.get(id);
    return record ? { ...record } : null;
  }

  async findAll(filter: FindOrdersFilter): Promise<PaginatedResult<OrderReadModel>> {
    let items = this.database.findAll();

    if (filter.status) {
      items = items.filter((item) => item.status === filter.status);
    }

    const total = items.length;
    const start = (filter.page - 1) * filter.limit;
    const page = items.slice(start, start + filter.limit);

    return {
      items: page.map((item) => ({ ...item })),
      total,
      page: filter.page,
      limit: filter.limit,
    };
  }
}
