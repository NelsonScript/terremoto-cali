import type { Order } from '../order.entity';
import { OrderStatus } from '../order-status.enum';

/**
 * Contrato del patrón State. Cada estado concreto del Order implementa
 * esta interfaz y decide, por sí mismo, qué transiciones son válidas.
 *
 * Nota: se usa `import type` para referenciar `Order` y evitar un ciclo de
 * dependencias en tiempo de ejecución entre la entidad y sus estados.
 */
export interface OrderState {
  readonly status: OrderStatus;

  process(order: Order): void;
  approve(order: Order): void;
  cancel(order: Order): void;
}
