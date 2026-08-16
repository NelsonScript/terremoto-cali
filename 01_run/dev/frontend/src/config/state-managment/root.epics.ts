import { combineEpics } from 'redux-observable';
import { fetchResumenEpic } from '@features/evento/application/redux/evento.epics';
import { enviarReporteEpic } from '@features/reportes/application/redux/reportes.epics';
import { registrarVoluntarioEpic } from '@features/voluntariado/application/redux/voluntariado.epics';
import { fetchSismosEpic } from '@features/sismicidad/application/redux/sismicidad.epics';
import { fetchNoticiasEpic } from '@features/feed-noticias/application/redux/feed-noticias.epics';

export const rootEpic = combineEpics(
  // evento
  fetchResumenEpic,
  // reportes
  enviarReporteEpic,
  // voluntariado
  registrarVoluntarioEpic,
  // sismicidad
  fetchSismosEpic,
  // feed-noticias
  fetchNoticiasEpic
);
