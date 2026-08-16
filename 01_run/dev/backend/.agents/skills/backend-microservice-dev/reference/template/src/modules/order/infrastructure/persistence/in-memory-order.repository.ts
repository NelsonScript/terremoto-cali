import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/order.entity';
import { IOrderRepository } from '../../domain/order.repository';
import { OrderInMemoryDatabase } from './order-in-memory.database';

/**
 * Implementación concreta del puerto `IOrderRepository` (lado de
 * escritura del CQRS).
 *
 * Esta versión usa un almacén en memoria únicamente para que el módulo
 * sea ejecutable "out of the box" sin infraestructura externa. En
 * producción se reemplaza por una implementación real (TypeORM, Prisma,
 * Mongoose, etc.) — ver `typeorm-order.repository.example.ts` como
 * referencia — sin tocar ni el dominio ni la capa de aplicación, gracias
 * a la inyección por token (`ORDER_REPOSITORY`) definida en
 * `order.module.ts`.
 */
@Injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  constructor(private readonly database: OrderInMemoryDatabase) {}

  async findById(id: string): Promise<Order | null> {
    const record = this.database.get(id);
    if (!record) {
      return null;
    }
    return Order.fromPrimitives(record);
  }

  async save(order: Order): Promise<void> {
    this.database.upsert(order.toPrimitives());
  }
}
