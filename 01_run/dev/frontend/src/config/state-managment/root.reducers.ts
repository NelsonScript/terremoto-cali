import { combineReducers } from '@reduxjs/toolkit';
import eventoReducer from '@features/evento/application/redux/evento.slice';
import reportesReducer from '@features/reportes/application/redux/reportes.slice';
import voluntariadoReducer from '@features/voluntariado/application/redux/voluntariado.slice';
import sismicidadReducer from '@features/sismicidad/application/redux/sismicidad.slice';
import feedNoticiasReducer from '@features/feed-noticias/application/redux/feed-noticias.slice';

export const rootReducer = combineReducers({
  evento: eventoReducer,
  reportes: reportesReducer,
  voluntariado: voluntariadoReducer,
  sismicidad: sismicidadReducer,
  feedNoticias: feedNoticiasReducer,
  // NOTE: registrar aquí el reducer de cada feature nuevo que use Redux.
});
