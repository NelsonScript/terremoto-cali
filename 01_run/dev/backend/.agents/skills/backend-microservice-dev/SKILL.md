---
name: backend-microservice-dev
description: Scaffolding y evolución de microservicios backend en NestJS con arquitectura DDD + CQRS + Hexagonal. Úsalo cuando el usuario pida crear un microservicio backend nuevo dentro de backend/, o agregar/evolucionar comandos, queries, eventos o estados en uno ya existente, hasta dejarlo listo para producción. Vive en la raíz de backend/ — aplica a cualquier servicio bajo backend/<nombre>/, no a uno en particular.
---

# backend-microservice-dev

Skill de gobernanza + ejecución para construir y mantener microservicios en
`backend/`. Cubre dos flujos: **scaffolding inicial** (servicio nuevo desde
cero) y **evolución iterativa** (agregar capacidades a uno que ya existe),
ambos hasta cumplir el checklist de "listo para producción" de la sección 6.

Pensado para que lo ejecute un agente de código (Antigravity, Claude) sin
supervisión línea a línea — por eso cada paso incluye el criterio de
verificación explícito, no solo la acción.

## 0. Antes que nada: ¿este microservicio necesita esta arquitectura?

**No todo lo que vive en `backend/` es un microservicio.** Antes de
scaffolding, responde:

1. ¿Expone varias operaciones/rutas distintas (crear, listar, actualizar,
   aprobar, cancelar…) sobre uno o más recursos?
2. ¿Corre como proceso persistente (servidor HTTP) en vez de ejecutarse una
   vez y terminar?
3. ¿Se beneficia de separar lectura de escritura (CQRS) porque hay lógica de
   negocio real en las mutaciones, no solo un CRUD trivial?

**Si respondiste NO a la mayoría**, esto NO es un microservicio NestJS — es
un job de un solo comando (ej. una Cloud Function disparada por cron). En
ese caso NO uses este skill: instalar `@nestjs/core` + `@nestjs/cqrs`
completo (contenedor de DI, controladores HTTP, `CommandBus`/`QueryBus`) le
añade cold-start y complejidad a algo que no lo necesita.

Precedente real de esto en este mismo repo:
**`backend/clipping-osint-gemini/`** — una Cloud Function HTTP de un solo
flujo (busca → verifica → publica), disparada por Cloud Scheduler cada 3h.
Se evaluó explícitamente instalarle NestJS+CQRS completo y se descartó por
esta misma razón; en su lugar tiene DDD ligero **sin framework**: entidad de
dominio con máquina de estados (patrón State) y excepciones de dominio en
TypeScript puro, pero sin contenedor de DI ni capa HTTP de Nest. Es la
referencia de "cuándo NO aplica este skill" — revisa su `src/domain/` y
`src/application/` antes de asumir que todo necesita NestJS completo.

Si la respuesta es SÍ (es un servicio real con superficie de comandos y
queries), sigue con la sección 1.

## 1. Arquitectura obligatoria (resumen — detalle completo en `reference/ARCHITECTURE_RULES_BACKEND.md`)

- **3 capas** (Hexagonal/Cebolla): `domain/` (TypeScript puro, sin imports de
  Nest salvo `AggregateRoot`), `application/` (Command/Query/Event Handlers
  vía `@nestjs/cqrs`), `infrastructure/` (controladores HTTP, persistencia,
  filtros).
- **CQRS real**: todo Command tiene su Handler, todo Query tiene su Handler,
  separados. Los controladores HTTP son agnósticos a la lógica de negocio:
  reciben, validan (DTO + `class-validator`), despachan a `CommandBus` /
  `QueryBus`. **Cero `try/catch` en controladores.**
- **Máquina de estados (patrón State)** en toda entidad de dominio con
  ciclo de vida (más de un estado transitorio). Cada transición inválida
  lanza una excepción de dominio explícita.
- **Eventos de dominio**: cada transición exitosa se registra con
  `this.apply(...)` en la entidad (que extiende `AggregateRoot`). Los
  Command Handlers usan `EventPublisher.mergeObjectContext(...)` y llaman
  `.commit()` después de persistir.
- **Excepciones de dominio**: clase base con `errorCode` + status HTTP
  semántico, traducidas por un `DomainExceptionFilter` global (`@Catch`).
- **Repositorios por puerto**: interfaz en `domain/`, implementación en
  `infrastructure/`, inyectada por token de string
  (`provide: 'INombreRepository', useClass: ImplementacionConcreta`).

Esta arquitectura es intencionalmente la misma que se define en el punto 1
de las instrucciones originales de este skill (generación de un scaffold
NestJS/DDD/CQRS ilustrativo, contexto "Order/Pedido") — `reference/template/`
es exactamente ese scaffold, ya verificado (`tsc --noEmit` en modo strict,
cero errores).

## 2. Scaffolding inicial (microservicio nuevo)

1. Confirma el nombre del microservicio y el bounded context principal
   (ej. `solicitudes-ayuda`, entidad `SolicitudAyuda`) — pregunta si no está
   claro, no asumas.
2. Crea `backend/<nombre-del-servicio>/`.
3. Copia `reference/template/` completo ahí (estructura, no solo prosa).
4. Renombra el bounded context de ejemplo (`Order`/`Pedido`) al dominio
   real: entidad, estados, comandos, queries, eventos, excepciones,
   controlador, módulo — mismo patrón de archivos, nombres nuevos. Los
   estados del ejemplo (`CREATED → PROCESSING → APPROVED/CANCELLED`) son un
   punto de partida, no un molde fijo: modela el ciclo de vida real del
   nuevo dominio (puede tener más o menos estados).
5. Ajusta `package.json` (`name`, `description`) y `README.md` del servicio
   con la información real — sigue el mismo criterio de documentación que
   ya usa el proyecto: decisiones y su razonamiento, no solo el qué (ver
   `ARCHITECTURE_RULES.md` del frontend y `clipping-osint-gemini/README.md`
   como referencia de tono).
6. Verifica: `npm install && npx tsc -p tsconfig.json --noEmit` limpio.
7. Agrega el nuevo servicio al **Makefile raíz** del repo (ver sección 5 —
   obligatorio, no opcional, por la regla de gobernanza `environment-ops`).
8. Reporta al usuario el checklist de la sección 6 con el estado de cada
   ítem (recién scaffoldeado, la mayoría estará pendiente — eso es
   esperado, no un error).

## 3. Evolución iterativa (microservicio existente)

Para agregar un Command, Query, Event o estado nuevo a un microservicio que
ya sigue esta arquitectura:

1. Ubica la carpeta correspondiente (`application/commands/<nombre>/`,
   `application/queries/<nombre>/`, `domain/states/`, etc.) — sigue
   exactamente la convención de nombres de archivo ya presente en el
   servicio (`*.command.ts`, `*.handler.ts`, `*.query.ts`, `*.event.ts`,
   `*.exception.ts`, `*.state.ts`).
2. Si agregas un estado nuevo a la máquina de estados: crea la clase
   `NuevoEstado implements <Entidad>State`, decide explícitamente qué
   transiciones son válidas desde ahí (las demás deben lanzar la excepción
   de transición inválida — nunca dejarlas sin implementar), y actualiza el
   método `resolveState`/equivalente de la entidad.
3. Registra el nuevo Handler en `<servicio>.module.ts` (arrays
   `CommandHandlers`/`QueryHandlers`/`EventHandlers`) — un handler que
   existe pero no está registrado en el módulo falla en silencio (Nest no
   lo conecta al bus).
4. Agrega tests para lo nuevo (ver sección 6 — dominio y handler, mínimo).
5. Verifica `tsc --noEmit` + suite de tests limpios ANTES de considerar la
   iteración terminada. Si algo falla, arréglalo en la misma iteración — no
   dejes el árbol roto entre iteraciones.
6. Repite hasta cubrir todo lo pedido, evaluando el checklist de la sección
   6 en cada punto de parada natural (no solo al final).

## 4. Bucle de iteración — cómo debe operar el agente

Este skill es para trabajo sostenido, no un solo paso: después de scaffolding
o de cada cambio de evolución, el agente debe **compilar y correr tests
antes de seguir avanzando**, arreglar lo que falle en la misma iteración, y
solo detenerse a reportar cuando: (a) se cumplió lo pedido explícitamente
por el usuario, o (b) el checklist de producción (sección 6) está
completo, o (c) hay una decisión que requiere al usuario (ej. nombre de
proyecto GCP, service account, si el servicio necesita auth). No te
detengas a mitad de una iteración con el build roto.

## 5. Integración obligatoria con el Makefile raíz

Regla de gobernanza del repo (`​.agents/skills/environment-ops/SKILL.md`,
raíz de `terremoto-cali/`): **toda operación de build/test/deploy se
orquesta desde el `Makefile` en la raíz del repositorio** (`terremoto-cali/
Makefile`), nunca con comandos sueltos documentados solo en el README de un
servicio. Al scaffoldear o evolucionar un microservicio, agrega/actualiza en
ese Makefile (siguiendo el patrón ya usado por `build-clipping` /
`deploy-clipping` / `verify-clipping`):

```makefile
build-<nombre>:
	@echo "==> Compilando <nombre>..."
	cd 01_run/dev/backend/<nombre> && npm install && npm run build

test-<nombre>:
	@echo "==> Corriendo tests de <nombre>..."
	cd 01_run/dev/backend/<nombre> && npm test

deploy-<nombre>: build-<nombre> test-<nombre>
	@echo "==> Desplegando <nombre>..."
	cd 01_run/dev/backend/<nombre> && <comando de deploy real — ver nota>
```

No hay todavía un precedente de deploy para un microservicio NestJS
persistente en este repo (`clipping-osint-gemini` es una Cloud Function de
un solo comando, no aplica igual). El candidato por defecto para un
servicio NestJS con múltiples rutas es **Cloud Run** (Dockerfile + `gcloud
run deploy`), no Cloud Functions Gen2 — pero confirma con el usuario el
proyecto GCP, la región y si necesita autenticación antes de fijar el
comando de deploy real en el Makefile.

## 6. Checklist de "listo para producción"

El agente itera (sección 4) hasta que esto esté completo, y lo reporta
explícitamente al usuario — no asumas que "compila" ya es "listo":

- [ ] `tsc -p tsconfig.json --noEmit` limpio en modo `strict`.
- [ ] Tests unitarios de dominio: cada transición VÁLIDA e INVÁLIDA de la
      máquina de estados tiene un test (igual que se hizo para el refactor
      de `clipping-osint-gemini` — ver su `smoke-test.js` como referencia
      de qué cubrir, aunque ahí no se usó un framework de test formal).
- [ ] Tests de los Command/Query Handlers de aplicación (con repositorio
      falso/in-memory, sin infraestructura real).
- [ ] Al menos un test de integración end-to-end del flujo principal
      (crear → transicionar → consultar) contra la app de Nest completa
      (`@nestjs/testing`).
- [ ] Cada `errorCode` de dominio tiene un caso de prueba que confirma que
      el `DomainExceptionFilter` lo traduce al status HTTP correcto.
- [ ] Configuración por variables de entorno, con **fail-fast** si falta
      una crítica al arrancar (mismo patrón que `GCP_PROJECT_ID` en
      `clipping-osint-gemini/src/index.ts` — un error claro al inicio, no
      un fallo críptico más adelante).
- [ ] Logging estructurado (JSON), no `console.log` suelto sin formato.
- [ ] `Dockerfile` + endpoint de healthcheck (`GET /health` o equivalente).
- [ ] `README.md` del servicio: qué hace, endpoints, variables de entorno,
      cómo correr local, cómo desplegar (referencia al target del Makefile,
      no comandos sueltos — ver sección 5).
- [ ] Makefile raíz actualizado con `build-<nombre>` / `test-<nombre>` /
      `deploy-<nombre>` (sección 5).
- [ ] Sin secretos ni credenciales hardcodeadas en el código (variables de
      entorno o Secret Manager).

## 7. Referencias

- `reference/ARCHITECTURE_RULES_BACKEND.md` — reglas completas de la
  arquitectura, en el mismo formato que `ARCHITECTURE_RULES.md` del
  frontend (numerado, con razonamiento explícito, pensado para agente y
  humano).
- `reference/template/` — scaffold NestJS + DDD + CQRS + Hexagonal ya
  verificado (contexto ilustrativo "Order/Pedido" con máquina de estados
  `CREATED → PROCESSING → APPROVED/CANCELLED`). Punto de partida para
  copiar y adaptar en el paso 2.3 — no reinventar la estructura de carpetas
  desde cero cada vez.
- `backend/clipping-osint-gemini/` — precedente real de cuándo NO aplica
  esta arquitectura completa (sección 0), y de cómo se ve DDD sin
  framework para un job de un solo comando.
