import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import * as reduxLogger from 'redux-logger';
import { rootEpic } from '@config/state-managment/root.epics';
import { rootReducer } from '@config/state-managment/root.reducers';

const epicMiddleware = createEpicMiddleware();

/**
 * `redux-logger` es CommonJS. Bajo `vite build` (Rollup) el import por
 * defecto resuelve bien, pero bajo el DEV SERVER de Vite (ESM nativo) el
 * interop CJS/ESM a veces entrega el namespace/objeto completo del módulo
 * (`{ createLogger, logger, default }`) en vez de la función esperada.
 * Redux Toolkit valida cada middleware con `typeof m === 'function'` y
 * `getDefaultMiddleware().concat(...)` revienta si no lo es. Se resuelve
 * `createLogger` de forma defensiva contra ambas formas (directa o anidada
 * en `.default`) para no depender de qué interop use el entorno.
 */
function crearMiddlewareLogger(): Middleware | null {
  const modulo = reduxLogger as unknown as {
    createLogger?: (options?: Record<string, unknown>) => Middleware;
    default?: { createLogger?: (options?: Record<string, unknown>) => Middleware };
  };
  const createLoggerFn = modulo.createLogger ?? modulo.default?.createLogger;
  return typeof createLoggerFn === 'function' ? createLoggerFn({ collapsed: true }) : null;
}

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(epicMiddleware);
    // El logger de Redux es ruidoso — solo en desarrollo, y solo si se pudo resolver la función real.
    if (!import.meta.env.DEV) return middleware;
    const loggerMiddleware = crearMiddlewareLogger();
    return loggerMiddleware ? middleware.concat(loggerMiddleware) : middleware;
  },
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
