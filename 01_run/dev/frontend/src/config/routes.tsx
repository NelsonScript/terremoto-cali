import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@features/layout/presentation/app-layout';
import { Home } from '@features/evento/presentation/home';
import { DepartamentosList } from '@features/departamentos/presentation/departamentos-list';
import { DepartamentoDetalle } from '@features/departamentos/presentation/departamento-detalle';
import { Albergues } from '@features/albergues/presentation/albergues';
import { Donar } from '@features/donar/presentation/donar';
import { ApoyoPrivado } from '@features/apoyo-privado/presentation/apoyo-privado';
import { Reportar } from '@features/reportes/presentation/reportar';
import { Voluntariado } from '@features/voluntariado/presentation/voluntariado';
import { LineasEmergencia } from '@features/lineas-emergencia/presentation/lineas-emergencia';
import { Salud } from '@features/salud/presentation/salud';
import { Tramites } from '@features/tramites/presentation/tramites';
import { Fuentes } from '@features/fuentes/presentation/fuentes';
import { Sismicidad } from '@features/sismicidad/presentation/sismicidad';
import { FeedNoticias } from '@features/feed-noticias/presentation/feed-noticias';
import { NotFound } from '@shared/components/not-found';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/departamentos', element: <DepartamentosList /> },
      { path: '/departamentos/:depto', element: <DepartamentoDetalle /> },
      { path: '/albergues', element: <Albergues /> },
      { path: '/donar', element: <Donar /> },
      { path: '/apoyo-privado', element: <ApoyoPrivado /> },
      { path: '/reportar', element: <Reportar /> },
      { path: '/voluntariado', element: <Voluntariado /> },
      { path: '/lineas-de-emergencia', element: <LineasEmergencia /> },
      { path: '/salud', element: <Salud /> },
      { path: '/tramites', element: <Tramites /> },
      { path: '/fuentes', element: <Fuentes /> },
      { path: '/sismicidad', element: <Sismicidad /> },
      { path: '/noticias', element: <FeedNoticias /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
