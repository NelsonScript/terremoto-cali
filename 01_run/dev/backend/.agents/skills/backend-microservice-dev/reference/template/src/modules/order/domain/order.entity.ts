import { AggregateRoot } from '@nestjs/cqrs';
import { OrderStatus } from './order-status.enum';
import { OrderState } from './states/order-state.interface';
import { CreatedState } from './states/created.state';
import { ProcessingState } from './states/processing.state';
import { ApprovedState } from './states/approved.state';
import { CancelledState } from './states/cancelled.state';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderStatusChangedEvent } from './events/order-status-changed.event';
import { InvalidOrderDataException } from './exceptions/invalid-order-data.exception';

export interface OrderProps {
  id: string;
  customerId: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Order (Pedido) — Entidad raíz de agregado del contexto acotado "Order".
 *
 * Reglas de diseño aplicadas:
 * - Hereda de AggregateRoot (@nestjs/cqrs) para poder registrar y publicar
 *   Eventos de Dominio mediante `this.apply()`.
 * - Es TypeScript puro fuera de esa única dependencia: no conoce HTTP,
 *   ORM, ni ningún otro detalle de infraestructura.
 * - Delega las reglas de transición de estado en el patrón State
 *   (OrderState / CreatedState / ProcessingState / ApprovedState /
 *   CancelledState), evitando condicionales gigantes dentro de la entidad.
 */
export class Order extends AggregateRoot {
  private readonly _id: string;
  private readonly _customerId: string;
  private readonly _amount: number;
  private _status: OrderStatus;
  private _state: OrderState;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: OrderProps) {
    super();
    this._id = props.id;
    this._customerId = props.customerId;
    this._amount = props.amount;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._state = Order.resolveState(props.status);
  }

  /**
   * Factory principal: crea un Order nuevo aplicando invariantes de
   * negocio y registrando el evento OrderCreatedEvent.
   */
  static create(params: { id: string; customerId: string; amount: number }): Order {
    if (!params.customerId?.trim()) {
      throw new InvalidOrderDataException('customerId es requerido.');
    }
    if (!Number.isFinite(params.amount) || params.amount <= 0) {
      throw new InvalidOrderDataException('amount debe ser un número mayor que cero.');
    }

    const now = new Date();
    const order = new Order({
      id: params.id,
      customerId: params.customerId,
      amount: params.amount,
      status: OrderStatus.CREATED,
      createdAt: now,
      updatedAt: now,
    });

    order.apply(
      new OrderCreatedEvent(order._id, order._customerId, order._amount, now),
    );

    return order;
  }

  /**
   * Reconstruye un Order desde persistencia. No dispara eventos de
   * dominio, ya que no representa un cambio de negocio, sino una lectura.
   */
  static fromPrimitives(props: OrderProps): Order {
    return new Order(props);
  }

  private static resolveState(status: OrderStatus): OrderState {
    switch (status) {
      case OrderStatus.CREATED:
        return new CreatedState();
      case OrderStatus.PROCESSING:
        return new ProcessingState();
      case OrderStatus.APPROVED:
        return new ApprovedState();
      case OrderStatus.CANCELLED:
        return new CancelledState();
      default: {
        const exhaustiveCheck: never = status;
        throw new InvalidOrderDataException(`Estado desconocido: ${exhaustiveCheck}`);
      }
    }
  }

  // ---- API pública de negocio: delega en el estado actual ----

  /** CREATED -> PROCESSING */
  process(): void {
    this._state.process(this);
  }

  /** PROCESSING -> APPROVED */
  approve(): void {
    this._state.approve(this);
  }

  /** CREATED | PROCESSING -> CANCELLED */
  cancel(): void {
    this._state.cancel(this);
  }

  /**
   * Usado EXCLUSIVAMENTE por las clases OrderState para aplicar una
   * transición ya validada y registrar el Evento de Dominio
   * correspondiente. No debe invocarse desde fuera de la capa de dominio.
   */
  setStatus(newStatus: OrderStatus): void {
    const previousStatus = this._status;
    this._status = newStatus;
    this._state = Order.resolveState(newStatus);
    this._updatedAt = new Date();

    this.apply(
      new OrderStatusChangedEvent(this._id, previousStatus, newStatus, this._updatedAt),
    );
  }

  // ---- Getters de solo lectura ----

  get id(): string { return this._id; }
  get customerId(): string { return this._customerId; }
  get amount(): number { return this._amount; }
  get status(): OrderStatus { return this._status; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  toPrimitives(): OrderProps {
    return {
      id: this._id,
      customerId: this._customerId,
      amount: this._amount,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
