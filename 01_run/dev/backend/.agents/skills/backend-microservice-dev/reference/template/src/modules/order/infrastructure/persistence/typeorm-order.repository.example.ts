/**
 * REFERENCIA — NO se registra en `order.module.ts` por defecto.
 *
 * Ejemplo de cómo se vería la implementación de `IOrderRepository` contra
 * una base de datos real usando TypeORM, para ilustrar que sustituir
 * `InMemoryOrderRepository` es un cambio aislado a infraestructura: basta
 * con registrar esta clase en el provider `ORDER_REPOSITORY` del módulo.
 *
 * Requiere: `npm i @nestjs/typeorm typeorm pg` (o el driver que aplique)
 * y renombrar este archivo quitando `.example`.
 */

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';
// import { Order } from '../../domain/order.entity';
// import { IOrderRepository } from '../../domain/order.repository';
// import { OrderStatus } from '../../domain/order-status.enum';
//
// @Entity('orders')
// export class OrderOrmEntity {
//   @PrimaryColumn('uuid')
//   id: string;
//
//   @Column()
//   customerId: string;
//
//   @Column('decimal')
//   amount: number;
//
//   @Column({ type: 'enum', enum: OrderStatus })
//   status: OrderStatus;
//
//   @Column()
//   createdAt: Date;
//
//   @Column()
//   updatedAt: Date;
// }
//
// @Injectable()
// export class TypeOrmOrderRepository implements IOrderRepository {
//   constructor(
//     @InjectRepository(OrderOrmEntity)
//     private readonly repository: Repository<OrderOrmEntity>,
//   ) {}
//
//   async findById(id: string): Promise<Order | null> {
//     const entity = await this.repository.findOneBy({ id });
//     return entity ? Order.fromPrimitives(entity) : null;
//   }
//
//   async save(order: Order): Promise<void> {
//     await this.repository.save(order.toPrimitives());
//   }
// }
