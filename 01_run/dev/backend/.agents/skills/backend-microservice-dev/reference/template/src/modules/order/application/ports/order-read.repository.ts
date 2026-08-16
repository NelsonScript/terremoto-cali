import { OrderReadModel } from '../read-models/order-read-model';
import { OrderStatus } from '../../domain/order-status.enum';

export interface FindOrdersFilter {
  status?: OrderStatus;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Puerto de LECTURA, separado del puerto de escritura (IOrderRepository).
 * Representa el acceso rápido/optimizado a la base de datos para las
 * Queries, sin reconstruir el agregado de dominio.
 */
export interface IOrderReadRepository {
  findById(id: string): Promise<OrderReadModel | null>;
  findAll(filter: FindOrdersFilter): Promise<PaginatedResult<OrderReadModel>>;
}

export const ORDER_READ_REPOSITORY = 'IOrderReadRepository';
