import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER } from '@nestjs/core';

// Controllers
import { OrderController } from './infrastructure/controllers/order.controller';

// Command Handlers
import { CreateOrderHandler } from './application/commands/create-order/create-order.handler';
import { ProcessOrderHandler } from './application/commands/process-order/process-order.handler';
import { ApproveOrderHandler } from './application/commands/approve-order/approve-order.handler';
import { CancelOrderHandler } from './application/commands/cancel-order/cancel-order.handler';

// Query Handlers
import { GetOrderByIdHandler } from './application/queries/get-order-by-id/get-order-by-id.handler';
import { GetOrdersHandler } from './application/queries/get-orders/get-orders.handler';

// Event Handlers
import { OrderCreatedHandler } from './application/events/handlers/order-created.handler';
import { OrderStatusChangedHandler } from './application/events/handlers/order-status-changed.handler';

// Domain ports
import { ORDER_REPOSITORY } from './domain/order.repository';
import { ORDER_READ_REPOSITORY } from './application/ports/order-read.repository';

// Infrastructure implementations
import { OrderInMemoryDatabase } from './infrastructure/persistence/order-in-memory.database';
import { InMemoryOrderRepository } from './infrastructure/persistence/in-memory-order.repository';
import { InMemoryOrderReadRepository } from './infrastructure/persistence/in-memory-order-read.repository';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';

const CommandHandlers = [
  CreateOrderHandler,
  ProcessOrderHandler,
  ApproveOrderHandler,
  CancelOrderHandler,
];

const QueryHandlers = [GetOrderByIdHandler, GetOrdersHandler];

const EventHandlers = [OrderCreatedHandler, OrderStatusChangedHandler];

@Module({
  imports: [CqrsModule],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,

    // Almacén compartido simulado (ver nota en order-in-memory.database.ts)
    OrderInMemoryDatabase,

    // Inyección por token de string: el dominio y la aplicación dependen
    // de la ABSTRACCIÓN (IOrderRepository / IOrderReadRepository), nunca
    // de la implementación concreta.
    {
      provide: ORDER_REPOSITORY,
      useClass: InMemoryOrderRepository,
    },
    {
      provide: ORDER_READ_REPOSITORY,
      useClass: InMemoryOrderReadRepository,
    },

    // Filtro de excepciones de dominio, con alcance a este módulo.
    // Alternativa equivalente: app.useGlobalFilters(new DomainExceptionFilter())
    // en main.ts, si se prefiere aplicarlo a nivel de toda la aplicación
    // desde el bootstrap en lugar de por-módulo.
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class OrderModule {}
