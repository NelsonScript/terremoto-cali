# ARCHITECTURE_RULES_BACKEND.md — NestJS + DDD + CQRS + Hexagonal

Reglas de gobernanza para crear y evolucionar microservicios en `backend/`
de este proyecto (y en cualquier otro que adopte el mismo patrón). Pensado
para ser leído tanto por un humano como por un agente de código (Antigravity,
Claude, Cursor, etc.) antes de tocar código — si vas a crear o modificar un
microservicio backend, sigue este documento. Es el equivalente para backend
del `ARCHITECTURE_RULES.md` del frontend (`01_run/dev/frontend/`) — mismo
espíritu: reglas + el razonamiento detrás de cada una, no solo el qué.

Referencia de implementación real de cada regla: `reference/template/` (en
este mismo skill) — scaffold completo, verificado con `tsc --noEmit` en
modo strict, contexto ilustrativo "Order/Pedido". Ante la duda, mira cómo
lo resuelve ese scaffold.

## 1. Estructura por microservicio (Hexagonal / Cebolla)

Cada microservicio vive en `backend/<nombre>/` con su propio
`package.json`/`tsconfig.json` — **aislado**, sin workspace compartido con
otros servicios de `backend/` ni con `frontend/` (mismo criterio ya
establecido para `clipping-osint-gemini`: si dos servicios necesitan el
mismo schema/contrato, se copia y se documenta como copia sincronizada, no
se comparte vía import — evita acoplar despliegues independientes).

```
backend/<nombre>/src/modules/<bounded-context>/
  <bounded-context>.module.ts        Wiring de NestJS (DI, handlers, filtro)

  domain/                             ---- TypeScript puro ----
    <entidad>.entity.ts               AggregateRoot + delega en el State
    <entidad>.repository.ts           Puerto (interfaz) del repositorio
    <entidad>-status.enum.ts
    states/                           Patrón State
      <entidad>-state.interface.ts
      <estado-1>.state.ts
      <estado-2>.state.ts
      ...
    events/
      <entidad>-creado.event.ts
      <entidad>-estado-cambiado.event.ts
    exceptions/
      domain.exception.ts             Base: errorCode + httpStatusHint
      invalid-<entidad>-transition.exception.ts
      invalid-<entidad>-data.exception.ts
      <entidad>-not-found.exception.ts

  application/                        ---- CQRS ----
    commands/<accion>/
      <accion>.command.ts
      <accion>.handler.ts
    queries/<consulta>/
      <consulta>.query.ts
      <consulta>.handler.ts
    events/handlers/
      <evento>.handler.ts
    ports/
      <entidad>-read.repository.ts    Puerto de LECTURA, separado del de escritura
    read-models/
      <entidad>-read-model.ts

  infrastructure/                     ---- Detalles técnicos ----
    controllers/
      <entidad>.controller.ts         HTTP, sin try/catch, solo dispatch
      dtos/
        <accion>.dto.ts
    filters/
      domain-exception.filter.ts
    persistence/
      <implementación-real>.repository.ts
      <implementación-real>-read.repository.ts
```

Regla de dependencia: `infrastructure → application → domain`,
`infrastructure → domain`. **Domain no importa nada de las otras dos
capas** (excepción única y deliberada: `AggregateRoot` de `@nestjs/cqrs`
— ver §2). Application no importa de `infrastructure` directamente, solo
de los puertos (interfaces) que `infrastructure` implementa.

## 2. CQRS real con `@nestjs/cqrs`

Todo Command tiene su `CommandHandler`, todo Query tiene su `QueryHandler`,
en archivos separados — nunca un handler que resuelve ambos casos con un
`if`. El `CommandBus`/`QueryBus` es el único punto de entrada desde
`infrastructure/controllers/`.

**Los controladores HTTP son agnósticos a la lógica de negocio.** Su única
responsabilidad: recibir la petición, validar/mapear con un DTO
(`class-validator` + `class-transformer`), y despachar:

```ts
@Post()
create(@Body() dto: CreateXDto) {
  return this.commandBus.execute(new CreateXCommand(dto.campo));
}
```

**Cero `try/catch` en controladores.** Cualquier excepción de dominio se
propaga y la captura el `DomainExceptionFilter` global (§5) — un
controlador con `try/catch` está reimplementando lo que ya hace el filtro,
y typicamente termina devolviendo respuestas de error inconsistentes entre
endpoints.

**Excepción de dominio, no de framework**: la entidad de dominio hereda de
`AggregateRoot` (de `@nestjs/cqrs`) — es la única dependencia de un
framework permitida en `domain/`, porque es una clase base ligera sin
lógica de infraestructura (solo acumula y expone eventos), no un
acoplamiento real a Nest.

## 3. Máquina de estados (patrón State) para el ciclo de vida

Toda entidad de dominio con más de un estado transitorio se modela con el
patrón State — nunca con `if`/`switch` de estados desperdigados dentro de
la entidad o, peor, en los handlers de aplicación.

- Interfaz `<Entidad>State` con un método por acción de negocio
  (`aprobar`, `cancelar`, `publicar`, lo que aplique al dominio real).
- Una clase por estado, que decide **por sí misma** qué transiciones son
  válidas desde ahí. Toda transición no listada explícitamente lanza la
  excepción de transición inválida — no dejar un método sin implementar
  ni con un `// TODO`.
- La entidad delega: `aprobar(): void { this.estado.aprobar(this); }` — el
  método público de negocio nunca contiene la lógica de la transición, solo
  reenvía al estado activo.
- Cada transición exitosa se aplica mediante un método interno
  (`transicionarA`/`setStatus`, usado EXCLUSIVAMENTE por las clases State)
  que actualiza el estado y registra el evento de dominio correspondiente
  con `this.apply(...)`.

Referencia real de dos dominios distintos con este mismo patrón: el
scaffold de `Order` (`reference/template/`, estados
`CREATED → PROCESSING → APPROVED/CANCELLED`) y el refactor real de
`clipping-osint-gemini` (`NoticiaClip`, estados
`CANDIDATA → VERIFICADA → PUBLICADA/DESCARTADA`) — mismo patrón, dos
bounded contexts distintos, confirma que es reutilizable.

## 4. Eventos de dominio

Cada transición exitosa de la máquina de estados registra un evento de
dominio con `this.apply(new AlgoEvent(...))`. Los eventos son clases
planas (sin dependencias de framework), viven en `domain/events/`.

En la capa de aplicación, los Command Handlers:
1. Cargan el agregado del repositorio.
2. Lo envuelven con `this.eventPublisher.mergeObjectContext(agregado)`.
3. Invocan el método de negocio (que aplica el/los evento(s) internamente).
4. Persisten (`repository.save(agregado)`).
5. Llaman `agregado.commit()` — esto es lo que efectivamente publica los
   eventos acumulados al `EventBus`.

Los `EventsHandler` que reaccionan a esos eventos (`application/events/
handlers/`) son asíncronos y están desacoplados del Command Handler que
originó el cambio — no deben lanzar excepciones que reviertan la mutación
ya persistida; son para efectos secundarios (logging, notificaciones,
proyecciones de lectura), no para validación de negocio (esa vive en la
entidad, antes de que la transición se considere exitosa).

## 5. Excepciones de dominio + filtro HTTP global

- Clase base `DomainException` (abstracta) en `domain/exceptions/`, con
  `errorCode: string` (código de negocio estable) y `httpStatusHint:
  number` (la sugerencia de status HTTP semántico — el dominio no importa
  nada de `@nestjs/common`, pero sí puede declarar "esto es un 404" como
  un número plano).
- `DomainExceptionFilter` (`infrastructure/filters/`, `@Catch(DomainException)`)
  registrado como `APP_FILTER` (o `app.useGlobalFilters(...)` en
  `main.ts`) traduce cualquier excepción de dominio a JSON estandarizado:
  `{ statusCode, errorCode, message, timestamp, path }`.
- Nunca lances `Error` genérico desde el dominio para algo que el llamador
  necesita distinguir — si un caso de error tiene semántica de negocio
  (dato inválido, transición prohibida, recurso no encontrado), es una
  subclase de `DomainException` con su propio `errorCode`.

## 6. Repositorios: puerto en domain/, adaptador en infrastructure/

- La interfaz (`I<Entidad>Repository`) vive en `domain/` — el dominio
  declara qué necesita, no cómo se implementa.
- La implementación concreta vive en `infrastructure/persistence/` —
  Firestore, Postgres, in-memory (para desarrollo/tests), lo que aplique.
- Inyección por **token de string** en el módulo, nunca acoplando el
  dominio/aplicación a la clase concreta:

  ```ts
  { provide: 'IOrderRepository', useClass: FirestoreOrderRepository }
  ```

  Cambiar de implementación (ej. de in-memory a una BD real) es un cambio
  de una línea en el módulo — domain y application no se tocan.
- CQRS también aplica al repositorio: el puerto de LECTURA
  (`I<Entidad>ReadRepository`, en `application/ports/`) es una interfaz
  separada del puerto de ESCRITURA (`domain/`). La implementación de
  lectura puede devolver un Read Model plano sin pasar por
  `Entidad.fromPrimitives()` — simula/permite una consulta optimizada
  (vista desnormalizada, réplica de lectura) sin el costo de reconstruir
  el agregado completo.

## 7. Cuándo NO aplica esta arquitectura completa

Esta arquitectura (NestJS + `@nestjs/cqrs` + contenedor de DI + capa HTTP)
es para servicios que exponen **varias operaciones sobre uno o más
recursos, como proceso persistente**. No la fuerces en:

- Un job de un solo comando disparado por cron (Cloud Function/Cloud Run
  Job de una sola invocación) — el contenedor de DI y la capa HTTP de Nest
  añaden cold-start y complejidad sin beneficio. Precedente real:
  `backend/clipping-osint-gemini/` (ver su `src/domain/` — DDD ligero, sin
  framework, mismo patrón State pero sin `AggregateRoot` ni `@nestjs/cqrs`).
- Un script de migración/mantenimiento de una sola vez.
- Un CRUD trivial sin ninguna regla de negocio real en las mutaciones (ahí
  CQRS separa lectura/escritura sin ganar nada — evalúa si de verdad hace
  falta antes de montar toda la ceremonia).

Esta decisión se toma **antes** de scaffoldear, no a mitad de camino — ver
§0 del `SKILL.md` principal.

## 8. Integración con el Makefile raíz (gobernanza `environment-ops`)

Todo microservicio nuevo agrega sus targets (`build-<nombre>`,
`test-<nombre>`, `deploy-<nombre>`) al `Makefile` en la raíz del repo
(`terremoto-cali/Makefile`), siguiendo el patrón ya usado por
`build-clipping`/`deploy-clipping`/`verify-clipping`. Ningún comando de
build/test/deploy debe documentarse SOLO en el README de un servicio como
la forma de ejecutarlo — el Makefile es la fuente única de verdad
operativa del repo completo. Ver §5 del `SKILL.md` principal para el
patrón exacto.

## 9. Checklist de "listo para producción"

Ver §6 del `SKILL.md` principal — es la misma lista, no se duplica aquí
para evitar que las dos copias diverjan con el tiempo.

## 10. Convenciones de nombres de archivo

| Tipo                        | Convención                              |
|------------------------------|------------------------------------------|
| Entidad de dominio            | `<entidad>.entity.ts`                    |
| Enum de estado                | `<entidad>-status.enum.ts` / `-estado.enum.ts` |
| Interfaz de estado (State)    | `<entidad>-state.interface.ts`           |
| Clase de estado concreta      | `<nombre-estado>.state.ts`               |
| Comando                       | `<accion>.command.ts`                    |
| Handler de comando            | `<accion>.handler.ts`                    |
| Query                         | `<consulta>.query.ts`                    |
| Handler de query              | `<consulta>.handler.ts`                  |
| Evento de dominio              | `<algo>.event.ts`                        |
| Handler de evento              | `<algo>.handler.ts` (en `events/handlers/`) |
| Excepción de dominio           | `<algo>.exception.ts`                    |
| Puerto de repositorio (escritura) | `<entidad>.repository.ts` (en `domain/`) |
| Puerto de repositorio (lectura)   | `<entidad>-read.repository.ts` (en `application/ports/`) |
| Implementación de repositorio  | `<tecnologia>-<entidad>.repository.ts` (en `infrastructure/persistence/`) |
| Controlador                    | `<entidad>.controller.ts`                |
| DTO                            | `<accion>.dto.ts`                        |
| Módulo                         | `<bounded-context>.module.ts`            |

Todo en kebab-case, incluyendo carpetas. Clases en PascalCase, siguiendo el
nombre del archivo sin los puntos (`create-order.handler.ts` →
`CreateOrderHandler`).

## 11. Runtime y gestor de paquetes

Node LTS vigente (mismo criterio que `clipping-osint-gemini`: revisar
[soporte de runtime](https://docs.cloud.google.com/functions/docs/runtime-support)
antes de que el runtime elegido se descontinúe). Gestor de paquetes: `npm`
por defecto para `backend/` (consistente con `clipping-osint-gemini` — el
`frontend/` usa `pnpm`, pero son proyectos aislados sin workspace
compartido, así que no hace falta que coincidan). TypeScript en modo
`strict` sin excepciones — el scaffold de referencia compila limpio en ese
modo, cualquier microservicio nuevo debe mantener esa barra.
