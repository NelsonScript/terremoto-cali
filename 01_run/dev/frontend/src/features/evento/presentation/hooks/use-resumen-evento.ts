import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@config/state-managment/store';
import { fetchResumenRequest } from '@features/evento/application/redux/evento.actions';
import { selectEvento } from '@features/evento/application/redux/evento.selectors';
import { EventoActionTypes } from '@features/evento/application/redux/evento.action-types';

/**
 * Hook de Presentación compartido por toda página que necesita el resumen
 * del evento (home, salud, líneas de emergencia, fuentes, apoyo privado,
 * donar). Despachar la misma acción en cada página es intencional: Redux
 * Toolkit no vuelve a golpear infraestructura si ya hay datos en el store
 * (el reducer es idempotente) y así cada ruta funciona de forma
 * autocontenida sin importar por dónde entró la persona al sitio.
 */
export function useResumenEvento() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector(selectEvento);

  useEffect(() => {
    if (!data) dispatch(fetchResumenRequest());
  }, [dispatch, data]);

  return { data, error, isLoading: status === EventoActionTypes.FETCH_RESUMEN_LOADING && !data };
}
