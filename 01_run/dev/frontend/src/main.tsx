// Debe ser el primer import: inversify necesita reflect-metadata cargado
// antes que cualquier decorador (@injectable/@inject) se evalúe.
import 'reflect-metadata';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { router } from '@config/routes';
import store from '@config/state-managment/store';
import '@shared/design-system/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
