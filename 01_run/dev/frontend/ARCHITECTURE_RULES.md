# ARCHITECTURE_RULES.md — DDD + React + Redux + TaskEither

Reglas de gobernanza para desarrollar y mantener features en este proyecto (y en
cualquier otro que adopte el mismo patrón). Pensado para ser leído tanto por un
humano como por un agente de código (Claude, Antigravity, Cursor, etc.) antes de
tocar código: si vas a crear o modificar un feature, sigue este documento.

Referencia de implementación real de cada regla: `src/features/evento/` (patrón
de LECTURA completo) y `src/features/reportes/` (patrón de ESCRITURA completo,
con máquina de estados). Ante la duda, mira cómo lo resuelven esos dos.

Este patrón está inspirado en un proyecto de referencia interno (Vite + React +
DDD, con Redux Toolkit + redux-observable + fp-ts + inversify) — aquí se
adaptó y se documentan explícitamente las decisiones que se tomaron distinto.

## 1. Estructura por feature

Cada feature vive en `src/features/<nombre>/` con hasta cuatro capas. **No
todo feature necesita las cuatro** — ver §4.

```
features/<nombre>/
  domain/
    entities/           interfaces de las "cosas" del dominio (sin lógica)
    schemas/             validación con zod (para inputs externos: forms, APIs)
    services/             funciones puras de regla de negocio (sin I/O)
    <nombre>.repository.ts   CONTRATO (interface) — nunca la implementación
  application/
    container/           bindings de inversify (IoC) para este feature
    usecases/             orquesta domain + infraestructure
    redux/                actions, action-types, slice, selectors, epics
    machine/              máquina de estados (si el caso de uso la necesita)
  infraestructure/
    service/              implementación concreta del repository (Firestore,
                           HTTP, JSON estático…) + su excepción de capa
  presentation/
    <nombre>.tsx            vistas/páginas (se registran en config/routes.tsx)
    componentes/           componentes "dumb" específicos del feature
```

**Convención de nombres en `presentation/` (React puro, sin nada del patrón de
Next.js):** ningún archivo lleva sufijo `.page.tsx` — es `<nombre>.tsx` a
secas, igual que cualquier otro componente visual. El componente exportado
tampoco lleva sufijo `Page` en el nombre: se declara como constante con
`React.FC` (o `FC<Props>` de `'react'`), no como `function`, siguiendo el
patrón del boilerplate de referencia:

```tsx
import type { FC } from 'react';

export const Home: FC = () => {
  // ...
};
```

Esto aplica a TODO componente visual del proyecto, no solo a las vistas que
se registran como ruta: páginas, layout (`AppLayout`, `SiteHeader`, etc.),
componentes "dumb" de cada feature y los compartidos en
`shared/components/`. Ejemplo real: `features/evento/presentation/home.tsx`
exporta `Home` (no `HomePage`), `shared/components/not-found/index.tsx`
exporta `NotFound` (no `NotFoundPage`).

**Cómo se identifica una vista sin el sufijo `.page`:** la señal ya no es el
nombre del archivo, es su **ubicación**. Un archivo `<nombre>.tsx` que vive
directamente en `presentation/` (al mismo nivel que `componentes/`, no
dentro de esa subcarpeta) es, por convención, la vista/entry-point de ese
feature — el componente que se registra en `config/routes.tsx`. Un archivo
dentro de `presentation/componentes/` es un componente "dumb" de soporte,
no una vista. No hace falta ningún sufijo (`.page`, `View`, `Screen`, etc.)
para distinguirlos: la carpeta ya lo comunica. Esta regla aplica igual a
`shared/components/`, donde todo lo que vive ahí es, por definición,
componente compartido — nunca una vista de feature.

Regla de dependencia: `presentation → application → domain`,
`infraestructure → domain`. Domain no importa nada de las otras tres capas.
Presentation nunca importa de `infraestructure/` directamente.

## 2. Cuándo usar Redux + redux-observable + TaskEither (ceremonia completa)

Usa la ceremonia completa (repository con `TaskEither` → usecase → epic →
acción de Redux → slice) **solo cuando la operación cruza un límite de I/O
real**: escritura a Firestore, una futura llamada a una API externa (UNGRD,
SGC, USGS…), cualquier cosa que pueda fallar de verdad y tarde un tiempo
variable.

Ejemplo de referencia: `features/reportes/` — el formulario despacha
`enviarReporteRequest`, un epic (`reportes.epics.ts`) llama al UseCase, el
UseCase valida con zod y llama al repository (que devuelve `TaskEither`), el
resultado se convierte a Observable con `fromTaskEither` y termina en
`enviarReporteSuccess` o `enviarReporteFailure`.

**No** uses esta ceremonia para lecturas síncronas de contenido local (JSON
versionado en el repo). En ese caso el repository devuelve el valor
directamente (sin `TaskEither`, sin Promise) y la página de Presentación lo
pide vía el contenedor IoC, sin pasar por Redux. Ejemplo:
`features/departamentos/` — `DepartamentosUseCases.listarTodos()` es
síncrono y se llama directo desde `departamentos-list.tsx`.

Esto es una decisión de diseño explícita, no un atajo: forzar Redux+epics en
una lectura síncrona añade ceremonia sin ningún beneficio (no hay nada async
que orquestar, no hay condición de carrera que evitar). El día que esa
lectura se vuelva una llamada real a una API, el contrato del repository pasa
a `TaskEither` y ahí sí se agrega Redux+epic — el Use Case y la Presentación
apenas cambian.

## 3. Excepciones por capa

Cada capa que puede fallar define su propia excepción, heredando de
`shared/core/error/layered-exception.ts` (`LayeredException`). El mensaje
siempre tiene el formato `Clase.metodo :: causa`, y encadena: si
`ReportesFirestoreService.crear` falla, el UseCase la envuelve en
`ReportesUseCasesException`, y el mensaje final que ve el usuario/log es
`ReportesUseCasesException.enviarReporte :: ReportesServiceException.crear ::
<mensaje original>` — se puede leer exactamente en qué capa y método
ocurrió el fallo sin necesitar el stack trace completo.

## 4. Cuándo NO forzar las cuatro capas

Una página 100% estática, sin datos que puedan cambiar entre despliegues
(ej. `features/tramites/`), es Presentación pura: no necesita
domain/application/infraestructure. Forzar un repository que envuelve un
array hardcodeado no aporta nada. Si esa página empieza a depender de datos
reales, ahí se le agregan las capas que hagan falta.

## 5. Repositorio compartido vs. repositorio propio

Un feature puede depender del repository de OTRO feature cuando el dato es
genuinamente de ese bounded context — no lo dupliques. Ejemplo: `salud`,
`lineas-emergencia`, `fuentes`, `apoyo-privado` y `donar` no tienen su propio
repository: todos leen del `EventoRepository` (bounded context "evento", el
estado agregado/global de la emergencia) o del `DepartamentosRepository`
(bounded context "departamentos", la colección de departamentos). Solo
`presentation/` es propia de cada uno de esos features.

## 6. Contenedor IoC (inversify)

Cada feature que tiene `application/usecases` tiene su propio
`application/container/<feature>.ioc.ts` con un `Container` de inversify
independiente (no hay un contenedor global único — cada feature es
autocontenido). Los tokens son `Symbol.for(...)` en un archivo
`<feature>.ioc.types.ts` separado del `.ioc.ts` para poder importarlos desde
Presentation sin arrastrar el binding concreto.

`main.tsx` importa `reflect-metadata` como el PRIMER import del archivo —
sin eso, los decoradores `@injectable()`/`@inject()` fallan en runtime.

## 7. Máquina de estados (Application)

Cuando un caso de uso tiene un flujo con más de un estado transitorio
(idle → enviando → éxito | error), se modela con
`shared/core/state-machine/create-state-machine.ts` en
`application/machine/<algo>.machine.ts`, y el slice de Redux delega en ella
las transiciones (`createXMachine(state.estado).send('EVENTO').current`) en
vez de tener `if/else` de estados desperdigados en el reducer o, peor, en el
componente. Ver `features/reportes/application/machine/reporte.machine.ts` y
`features/voluntariado/application/machine/voluntario.machine.ts` (mismo
patrón, dos features distintos — confirma que es reutilizable).

## 8. Presentación

Componentes "dumb": reciben props, no llaman `useSelector`/`useDispatch`
directamente salvo que sean el punto de entrada de la vista (el componente
registrado en `config/routes.tsx`). Todo componente visual — vista de
feature, layout o compartido — se declara `export const Nombre: FC<Props> =
(...) => {...}`, sin sufijo `Page` en el nombre ni `.page` en el archivo
(ver §1). El componente compartido `shared/components/render` decide
loading/error/éxito a partir del estado que ya resolvió Redux — nunca decide
él mismo si algo está cargando.

## 9. Checklist para un feature nuevo

1. ¿Es contenido 100% estático? → solo `presentation/` (§4).
2. ¿Lee datos versionados localmente (JSON)? → repository síncrono, sin
   Redux, usecase llamado directo desde la página (§2). ¿El dato ya
   pertenece a otro bounded context (evento/departamentos)? → reusa su
   repository, no crees uno nuevo (§5).
3. ¿Escribe datos o llama una API real? → repository con `TaskEither`,
   usecase, container IoC, redux (action-types/actions/slice/epics/selectors)
   — registra el reducer en `config/state-managment/root.reducers.ts` y el
   epic en `root.epics.ts` (§2, §6).
4. ¿El caso de uso tiene más de dos estados transitorios? → máquina de
   estados en `application/machine/` (§7).
5. Cada clase de excepción nueva extiende `LayeredException` (§3).
6. Registra la vista en `config/routes.tsx`. Nombre de archivo y de
   componente sin sufijo `.page`/`Page` — vive directo en `presentation/`
   (no en `componentes/`), esa ubicación ya la identifica como vista — ver
   §1 y §8.

## 10. Consumo de una API externa real (primer caso: `sismicidad`)

Primer feature del proyecto que llama a un API de un tercero real en vez de
leer JSON local o escribir a Firestore — el patrón general de §2 aplica
igual (repository con `TaskEither` → usecase → epic → Redux), pero con dos
diferencias que vale la pena dejar explícitas para el próximo feature que
haga lo mismo. Referencia real: `src/features/sismicidad/` (consume el API
público FDSNWS del USGS para sismicidad reciente en la región).

- **Validar la respuesta cruda con zod antes de tocar cualquier otra capa.**
  El contrato de un tercero puede cambiar sin aviso — a diferencia de un JSON
  propio versionado en el repo, no hay ningún control sobre su forma. El
  schema de `domain/schemas/` valida el payload tal cual llega (ej.
  `RawSismoUsgsSchema`); si no valida, es un fallo de Infraestructura, nunca
  un dato parcial silencioso mostrado como si fuera bueno.
- **El mapeo del formato externo al modelo de dominio es una función pura
  en `domain/services/`** (ej. `mapear-sismo-usgs.service.ts`), separada del
  schema de validación. Esto es lo que permite que el día que se sume otra
  fuente para el mismo dominio (ej. si el SGC publica un API oficial), solo
  se agregue su propio mapper y su propia implementación de repository —
  el modelo de dominio (`Sismo`) y todo lo que está por encima no cambian.
- **¿Nuevo feature o se reusa un bounded context existente (§5)?** Depende
  de si el dato es genuinamente del mismo dominio. Sismicidad (eventos
  sísmicos individuales, de una fuente externa que se actualiza sola) NO es
  parte del bounded context `evento` (el estado agregado de la emergencia:
  cifras, hospitales, líneas — que se actualiza por PR) aunque ambos hablan
  del mismo desastre; por eso es un feature propio, no una extensión de
  `evento`.
- **Sondeo periódico, no push.** Ningún API público consultado hasta ahora
  ofrece push/websockets — "tiempo real" es sondeo (`setInterval` en la
  vista, con `clearInterval` en el cleanup del `useEffect`). La vista NO
  debe volver a mostrar el spinner de carga completo en cada sondeo
  posterior al primero (taparía datos ya visibles cada pocos minutos): solo
  la primera carga (sin datos aún) usa `Render.isLoading`; los sondeos
  siguientes muestran un indicador liviano ("Actualizando…") sin ocultar la
  lista ya renderizada.
- **Investigación de fuentes antes de prometer un feed en vivo.** Antes de
  integrar cualquier fuente "en tiempo real", confirmar con datos reales
  (no solo documentación) que: (a) el API existe y responde con la forma
  esperada, (b) es públicamente accesible desde el navegador (CORS) sin
  necesitar backend propio ni API key oculta, y (c) sus datos están
  realmente actualizados (no un dataset histórico abandonado). Para este
  proyecto se investigaron tres fuentes colombianas antes de elegir USGS:
  UNGRD vía `datos.gov.co` (API real pero el dataset más reciente encontrado
  es de 2022 — descartado por desactualizado) y el SGC (sin API pública
  documentada ni descubierta — sin la extensión de Chrome conectada para
  inspeccionar tráfico de red real del visor oficial, no se pudo confirmar
  un endpoint; queda pendiente, no descartado). Ningún API de gobierno
  colombiano encontrado publica cifras de fallecidos/heridos por
  departamento en tiempo real — esas cifras siguen siendo manuales,
  citando el boletín de UNGRD (ver `departamentos/`), y no deben
  presentarse como si vinieran de un feed en vivo.

## 11. Gotcha conocido: interop CJS/ESM de `redux-logger` en el dev server

`redux-logger` es CommonJS. Bajo `vite build` (Rollup) un `import logger
from 'redux-logger'` resuelve bien, pero bajo el **dev server** de Vite
(ESM nativo) el interop CJS/ESM a veces entrega el namespace/objeto
completo del módulo (`{ createLogger, logger, default }`) en vez de la
función esperada. `getDefaultMiddleware().concat(...)` de Redux Toolkit
valida cada middleware con `typeof m === 'function'` y revienta si no lo
es — el síntoma es que `pnpm dev` falla al arrancar (la app ni siquiera
llega a renderizar) mientras que `pnpm build` funciona sin problema, lo
cual hace el bug confuso de diagnosticar la primera vez.

**Solución aplicada en `config/state-managment/store.ts`**: en vez de un
import por defecto, se importa el namespace completo
(`import * as reduxLogger from 'redux-logger'`) y se resuelve
`createLogger` de forma defensiva contra ambas formas (`reduxLogger.
createLogger` o `reduxLogger.default.createLogger`), devolviendo `null` si
ninguna existe — el store nunca revienta por esto, en el peor caso
simplemente no hay logger en desarrollo. Ver `crearMiddlewareLogger()` en
ese archivo para la implementación exacta.

**Por qué queda documentado aquí y no solo como comentario en el código**:
cualquier otra dependencia CommonJS que se agregue a este proyecto (o a
uno que copie este patrón) puede pisar el mismo problema bajo el dev
server aunque compile perfecto en build de producción — antes de asumir
que un import "raro" es un bug del paquete, revisar si es este mismo
interop.

## 12. Lectura de una colección Firestore en vivo + agente autónomo como escritor (primer caso: `feed-noticias`)

Primer feature del proyecto que LEE una colección completa de Firestore
(varios documentos) en vez de un solo doc (`evento`, que además es JSON
local) o de solo escribir uno (`reportes`/`voluntariado`). Referencia real:
`src/features/feed-noticias/` — un feed de noticias de prensa NO oficial
sobre la emergencia, alimentado por un agente de clipping OSINT.

**Por qué existe este feature**: no hay ninguna fuente colombiana oficial
que publique cifras (fallecidos/heridos/daños) en tiempo real vía API (ver
§10) — pero sí se publica información a diario en prensa, aunque no esté
consolidada. En vez de que la app intente "consolidar" esas cifras como si
fueran oficiales, se muestran explícitamente etiquetadas como recopilación
de prensa (`noOficial: true` en cada documento), igual que el resto del
sitio muestra fuentes contradictorias por separado en vez de elegir una
(ver Decisiones clave en `resumen-entrega.md`).

- **Quién escribe en la colección no es un formulario de este cliente, es
  un agente autónomo.** `feed_noticias` se llena desde una tarea programada
  en la nube (no depende de que ningún computador esté encendido — ver
  scheduled task "Agente clipping OSINT — terremoto Colombia") que cada 4h
  busca noticias recientes, las verifica con técnicas tipo OSINT
  (corroboración cruzada entre ≥2 fuentes antes de marcar
  `corroboracion.nivel: 'multiple-fuentes'`, restricción a una lista de
  fuentes confiables, chequeo de fecha de publicación) y escribe los
  documentos directamente contra Firestore con el mismo mecanismo de
  "creación pública validada por esquema" que ya usan `reportes` y
  `voluntariado` (ver `firestore.rules`, función `esNoticiaClipValida`) — la
  única diferencia es que aquí el creador es un proceso automatizado en vez
  de un humano llenando un `<form>`. El límite de confianza sigue siendo el
  mismo: sin autenticación, solo validación de forma/tipo por campo: **esto
  no es spam-proof** (cualquiera con la API key pública del proyecto podría
  en teoría crear documentos que cumplan el esquema) — riesgo ya aceptado
  para reportes/voluntariado, no resuelto acá; para cerrarlo de verdad
  haría falta Firebase App Check o mover la escritura a una Cloud Function.
- **`feed_noticias` SÍ tiene lectura pública** (`allow read: if true`), a
  diferencia de `reportes`/`voluntariado` (`allow read: if false`) — es
  contenido que la propia web muestra a cualquier visitante, no un dato
  privado que solo el equipo coordinador consulta.
- **Cada documento se revalida con zod al leerlo** (`domain/schemas/
  noticia-clip.schema.ts`), con el mismo criterio que §10 aplica a la
  respuesta de un API de un tercero real: el escritor es un proceso sin
  supervisión humana por documento, así que no se confía en su forma solo
  porque las reglas de Firestore ya la validaron al escribir.
- **Un documento inválido no tumba el feed completo.** A diferencia de
  `sismicidad` (que invalida TODA la respuesta si el payload completo no
  valida, porque es una sola llamada a un API), acá cada documento se valida
  por separado y los inválidos simplemente se descartan de la lista — son N
  escrituras independientes de un mismo agente, no una sola respuesta
  atómica; un documento raro de una ejecución puntual del agente no debería
  ocultar el resto del feed, que sí es válido.
- **Query simple, sin filtros compuestos**: `orderBy('fechaPublicacion',
  'desc')` + `limit(60)`, sin `where()` — Firestore auto-indexa un solo
  campo de orden, así que no hace falta declarar un índice compuesto en
  `firestore.indexes.json`. El día que se agregue un filtro por
  departamento/categoría combinado con el orden, ahí sí hace falta declarar
  el índice compuesto y desplegarlo (`firebase deploy --only
  firestore:indexes`) antes de que la query funcione en producción.
- **Google Dataset Search queda descartado del todo, no solo pospuesto.**
  La idea original mencionaba publicar/consumir el feed vía
  `datasetsearch.research.google.com` — es un malentendido de lo que es
  esa herramienta (un buscador que indexa páginas ya publicadas en otro
  lugar con marcado `schema.org/Dataset`, no una API para publicar ni
  consumir datos programáticamente, sin indexación instantánea ni
  garantizada). El usuario decidió descartarlo por completo del plan, no
  dejarlo como capa opcional futura: la app lee y siempre leerá directo de
  Firestore, y no hay intención de perseguir descubribilidad externa vía
  Dataset Search más adelante. No agregar marcado `schema.org/Dataset` ni
  ninguna integración relacionada a menos que el usuario lo pida de nuevo
  explícitamente.
- **Sondeo periódico en la vista** (`setInterval` cada 10 min, igual
  patrón que §10) — el agente escribe cada 4h, así que sondear cada 10 min
  es más que suficiente para que la vista se sienta actualizada sin
  desperdiciar lecturas. Igual que sismicidad: solo la primera carga
  muestra el spinner completo, los sondeos siguientes muestran "Actualizando…"
  sin tapar la lista ya visible.

## 13. Migración del sitio existente

Este proyecto vive en `01_run/dev` y es el reemplazo en React puro + DDD del
sitio original en Next.js, que se conserva intacto en `01_run/dev__DEPRECATED`
solo como referencia histórica (ya no se toca ni se despliega). `01_run/dev`
es la versión activa que se mantiene y se despliega hacia adelante. Ver
`resumen-entrega.md` (Claude Project) para el estado de la migración.
