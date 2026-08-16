# Bounded Context: Order — NestJS + DDD + CQRS + Arquitectura Hexagonal

Contexto acotado de ejemplo (`Order` / Pedido) que implementa:

- Arquitectura Hexagonal (Domain / Application / Infrastructure).
- CQRS real con `@nestjs/cqrs` (Commands, Queries y Events separados).
- Máquina de estados (patrón State) dentro de la entidad de dominio.
- Eventos de dominio publicados vía `EventPublisher` + `AggregateRoot.commit()`.
- Filtro global de excepciones que traduce excepciones de dominio a HTTP.
- Repositorios inyectados por token de string (puerto/adaptador).

## Árbol de carpetas

```
order-context/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── main.ts
    ├── app.module.ts
    └── modules/
        └── order/
            ├── order.module.ts                     # Wiring de NestJS (DI, handlers, filtro)
            │
            ├── domain/                              # ---- CAPA DE DOMINIO (TS puro) ----
            │   ├── order.entity.ts                  # AggregateRoot + máquina de estados
            │   ├── order.repository.ts              # Puerto IOrderRepository (escritura)
            │   ├── order-status.enum.ts
            │   ├── states/                          # Patrón State
            │   │   ├── order-state.interface.ts
            │   │   ├── created.state.ts
            │   │   ├── processing.state.ts
            │   │   ├── approved.state.ts
            │   │   └── cancelled.state.ts
            │   ├── events/
            │   │   ├── order-created.event.ts
            │   │   └── order-status-changed.event.ts
            │   └── exceptions/
            │       ├── domain.exception.ts          # Excepción base (errorCode + httpStatusHint)
            │       ├── invalid-order-state-transition.exception.ts
            │       ├── invalid-order-data.exception.ts
            │       └── order-not-found.exception.ts
            │
            ├── application/                         # ---- CAPA DE APLICACIÓN (CQRS) ----
            │   ├── commands/
            │   │   ├── create-order/{create-order.command.ts, create-order.handler.ts}
            │   │   ├── process-order/{process-order.command.ts, process-order.handler.ts}
            │   │   ├── approve-order/{approve-order.command.ts, approve-order.handler.ts}
            │   │   └── cancel-order/{cancel-order.command.ts, cancel-order.handler.ts}
            │   ├── queries/
            │   │   ├── get-order-by-id/{get-order-by-id.query.ts, get-order-by-id.handler.ts}
            │   │   └── get-orders/{get-orders.query.ts, get-orders.handler.ts}
            │   ├── events/handlers/
            │   │   ├── order-created.handler.ts
            │   │   └── order-status-changed.handler.ts
            │   ├── ports/
            │   │   └── order-read.repository.ts      # Puerto IOrderReadRepository (lectura)
            │   └── read-models/
            │       └── order-read-model.ts
            │
            └── infrastructure/                       # ---- CAPA DE INFRAESTRUCTURA ----
                ├── controllers/
                │   ├── order.controller.ts            # HTTP, sin try/catch, solo dispatch
                │   └── dtos/
                │       ├── create-order.dto.ts
                │       └── get-orders.dto.ts
                ├── filters/
                │   └── domain-exception.filter.ts      # DomainExceptionFilter (@Catch global)
                └── persistence/
                    ├── order-in-memory.database.ts     # "BD" simulada compartida
                    ├── in-memory-order.repository.ts   # Implementa IOrderRepository
                    ├── in-memory-order-read.repository.ts # Implementa IOrderReadRepository
                    └── typeorm-order.repository.example.ts # Ejemplo comentado para producción
```

## Máquina de estados

```
CREATED ──process()──▶ PROCESSING ──approve()──▶ APPROVED (final)
   │                        │
   └──cancel()──▶ CANCELLED ◀──cancel()──┘        (final)
```

Cualquier transición no listada arriba (ej. `approve()` sobre un pedido en
`CREATED`, o cualquier acción sobre un pedido `APPROVED`/`CANCELLED`) lanza
`InvalidOrderStateTransitionException`.

## Flujo de una escritura (Command)

1. `OrderController` recibe el HTTP request, valida el DTO y despacha un
   `Command` vía `CommandBus.execute(...)`. No hay lógica de negocio ni
   try/catch en el controlador.
2. El `CommandHandler` correspondiente:
   - Carga el agregado desde `IOrderRepository` (token `'IOrderRepository'`).
   - Lo envuelve con `this.eventPublisher.mergeObjectContext(order)`.
   - Invoca el método de negocio (`order.process()`, `order.approve()`, ...).
   - La entidad valida la transición vía el patrón State y, si es válida,
     aplica un evento de dominio con `this.apply(...)`.
   - El handler persiste el agregado (`orderRepository.save(order)`).
   - El handler llama `order.commit()`, lo que publica los eventos
     acumulados a través del `EventBus` de `@nestjs/cqrs`.
3. Los `EventsHandler` (`OrderCreatedHandler`, `OrderStatusChangedHandler`)
   reaccionan de forma asíncrona y desacoplada (logging / notificación
   simulados).

## Flujo de una lectura (Query)

`OrderController` despacha una `Query` vía `QueryBus.execute(...)`. El
`QueryHandler` consulta directamente `IOrderReadRepository`, que devuelve
un `OrderReadModel` plano — **sin** pasar por `Order.fromPrimitives`,
simulando el acceso rápido de solo lectura típico de CQRS (vista
desnormalizada / réplica de lectura).

## Manejo de errores

Todas las excepciones de negocio extienden `DomainException` (dominio
puro, sin imports de `@nestjs/common`). El `DomainExceptionFilter`
(infraestructura) está registrado como `APP_FILTER` en `OrderModule` y
traduce cualquier `DomainException` a:

```json
{
  "statusCode": 404,
  "errorCode": "ORDER_NOT_FOUND",
  "message": "El pedido con id \"...\" no existe.",
  "timestamp": "2026-08-15T12:00:00.000Z",
  "path": "/orders/..."
}
```

## Endpoints HTTP

| Método | Ruta                | Descripción                              |
|--------|----------------------|-------------------------------------------|
| POST   | `/orders`            | Crea un pedido (`CreateOrderCommand`)     |
| POST   | `/orders/:id/process` | CREATED → PROCESSING                      |
| POST   | `/orders/:id/approve` | PROCESSING → APPROVED                     |
| POST   | `/orders/:id/cancel`  | CREATED/PROCESSING → CANCELLED            |
| GET    | `/orders/:id`         | Lectura optimizada de un pedido           |
| GET    | `/orders?status=&page=&limit=` | Listado paginado y filtrable    |

## Cómo integrarlo en un proyecto NestJS existente

1. Copia la carpeta `src/modules/order` dentro de tu proyecto.
2. Instala las dependencias listadas en `package.json` (`@nestjs/cqrs`,
   `class-validator`, `class-transformer`, etc.) si aún no las tienes.
3. Importa `OrderModule` en tu `AppModule` (ya está hecho como ejemplo en
   `src/app.module.ts`).
4. Para pasar a producción, reemplaza `InMemoryOrderRepository` /
   `InMemoryOrderReadRepository` por implementaciones reales (ver
   `typeorm-order.repository.example.ts`), cambiando únicamente el
   `useClass` en los providers de `order.module.ts` — el dominio y la
   aplicación no requieren ningún cambio.

## Verificación

Este scaffold compila sin errores con `npx tsc -p tsconfig.json --noEmit`
(TypeScript 5.4, modo `strict`).
