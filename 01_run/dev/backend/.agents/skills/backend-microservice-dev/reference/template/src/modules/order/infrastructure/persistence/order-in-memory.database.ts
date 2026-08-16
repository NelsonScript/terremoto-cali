import { Injectable } from '@nestjs/common';
import { OrderProps } from '../../domain/order.entity';

/**
 * Simula el almacén físico (tabla / colección) compartido por el lado de
 * escritura y el lado de lectura del contexto Order.
 *
 * En una infraestructura real esto NO existiría como clase: sería
 * simplemente la base de datos (Postgres, Mongo, etc.). Aquí se modela
 * como un singleton en memoria para que el módulo sea autocontenible y
 * ejecutable sin dependencias externas.
 */
@Injectable()
export class OrderInMemoryDatabase {
  private readonly records = new Map<string, OrderProps>();

  get(id: string): OrderProps | undefined {
    return this.records.get(id);
  }

  upsert(record: OrderProps): void {
    this.records.set(record.id, record);
  }

  findAll(): OrderProps[] {
    return Array.from(this.records.values());
  }
}
