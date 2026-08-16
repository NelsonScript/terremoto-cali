# Ayuda Suroccidente — dev-ddd

Reemplazo en React puro (sin Next.js) del sitio de ayuda del terremoto,
construido con **Domain-Driven Design**. Ver `ARCHITECTURE_RULES.md` antes
de tocar código: describe la estructura por feature, cuándo usar
Redux + TaskEither vs. lectura directa, y el resto de las reglas de
gobernanza de este proyecto.

## Stack

Vite + React 19 + TypeScript, gestor de paquetes **pnpm**. Redux Toolkit +
`react-redux`, `redux-observable` + RxJS (epics), `fp-ts` (`TaskEither`),
`inversify` + `reflect-metadata` (IoC por feature), `zod` (validación de
dominio), `react-router-dom`, `firebase` (Firestore).

## Comandos

```bash
pnpm install
pnpm dev       # servidor de desarrollo
pnpm build     # tsc -b && vite build
pnpm preview   # sirve dist/ para verificar el build de producción
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar con la configuración real
de Firebase (Firebase Console → Configuración del proyecto → Tus apps →
SDK config). Prefijo `VITE_` (no `NEXT_PUBLIC_`, es la convención de Vite).
Sin estas variables, los formularios de Reportar/Voluntariado muestran un
aviso y no envían — el resto del sitio funciona igual (lee JSON local).

## Estado de la migración

Este proyecto reemplaza a `01_run/dev` (Next.js), que queda archivado en
`01_run/dev__DEPRECATED`. `dev-ddd` no se despliega todavía a ningún
dominio — se está construyendo y verificando en paralelo. Ver
`resumen-entrega.md` en el Proyecto de Claude para el estado completo.
