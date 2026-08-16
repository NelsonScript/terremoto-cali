/**
 * Evento de dominio: se emite cuando un nuevo Order es creado.
 * Es un objeto plano, sin dependencias de NestJS.
 */
export class OrderCreatedEvent {
  constructor(
    readonly orderId: string,
    readonly customerId: string,
    readonly amount: number,
    readonly occurredAt: Date,
  ) {}
}
