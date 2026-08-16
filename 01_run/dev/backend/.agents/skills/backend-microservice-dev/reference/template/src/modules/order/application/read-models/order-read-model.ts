import { OrderStatus } from '../../domain/order-status.enum';

/**
 * Read Model plano usado exclusivamente por el lado de Queries (CQRS).
 * No es la entidad de dominio: no tiene comportamiento, solo datos, y se
 * arma directamente desde la fuente de lectura (proyección / réplica /
 * vista materializada) sin pasar por `Order.fromPrimitives`.
 */
export interface OrderReadModel {
  id: string;
  customerId: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
