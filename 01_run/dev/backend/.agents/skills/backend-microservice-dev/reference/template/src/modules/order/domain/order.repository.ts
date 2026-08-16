import { Order } from './order.entity';

/**
 * Puerto (contrato) del repositorio de escritura del agregado Order.
 * Vive en el dominio; la implementación concreta vive en infraestructura.
 * NestJS la inyecta mediante el token de string `IOrderRepository`.
 */
export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

export const ORDER_REPOSITORY = 'IOrderRepository';
