# Cómo usar esta plantilla

Esta carpeta es el punto de partida para scaffoldear un microservicio nuevo
(paso 2.3 del `SKILL.md`). Es el contexto ilustrativo "Order/Pedido"
(`CREATED → PROCESSING → APPROVED/CANCELLED`), verificado con
`npx tsc -p tsconfig.json --noEmit` en modo strict — cero errores.

## Pasos para adaptarla a un dominio real

1. Copia toda la carpeta a `backend/<nombre-del-servicio>/` (sin este
   archivo — bórralo una vez adaptada la plantilla, es solo instructivo).
2. Renombra `src/modules/order/` al bounded context real
   (`src/modules/<bounded-context>/`).
3. Dentro, renombra `Order` → `<Entidad>` en todos los archivos: la
   entidad, el enum de estado, las clases de estado, los comandos, las
   queries, los eventos, las excepciones, el controlador, el módulo. Usa
   buscar-y-reemplazar de `Order`/`order` → tu entidad, y `Pedido` (en los
   comentarios en español) → el nombre real en español si aplica.
4. Redefine los estados: los cuatro estados del ejemplo
   (`CREATED`/`PROCESSING`/`APPROVED`/`CANCELLED`) son un punto de partida,
   no un molde fijo. Ajusta el número de estados y las transiciones
   válidas al ciclo de vida real del dominio — actualiza
   `resolveState()` en la entidad y las clases en `domain/states/` para
   que coincidan.
5. Ajusta los campos de la entidad (`OrderProps`) a los campos reales del
   dominio.
6. Actualiza `package.json` (`name`, `description`) y borra este archivo.
7. Verifica: `npm install && npx tsc -p tsconfig.json --noEmit` — debe
   seguir compilando limpio después de los renombres.
8. Sigue con el paso 2.5 en adelante del `SKILL.md` (README real del
   servicio, integración con el Makefile raíz, checklist de producción).

El `README.md` original de esta plantilla (con el árbol de carpetas
completo y la explicación de cada flujo) queda como referencia de lectura
mientras adaptas — pero una vez renombrado el dominio, reemplázalo por la
documentación real del servicio nuevo.
