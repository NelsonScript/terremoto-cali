/**
 * Estados posibles del ciclo de vida de un Pedido (Order).
 *
 * CREATED     -> estado inicial al crear el pedido.
 * PROCESSING  -> el pedido está siendo procesado (pago, stock, etc).
 * APPROVED    -> estado final positivo, el pedido fue aprobado.
 * CANCELLED   -> estado final negativo, el pedido fue cancelado.
 */
export enum OrderStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
}
