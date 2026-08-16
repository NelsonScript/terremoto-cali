import type * as TE from 'fp-ts/TaskEither';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';
import type { SismicidadUsgsServiceException } from '@features/sismicidad/infraestructure/service/sismicidad-usgs.service.exception';

/**
 * Contrato del bounded context "sismicidad": actividad sísmica reciente en
 * la región. Es un contexto propio, no una extensión de `evento` — `evento`
 * es el estado agregado de la emergencia (cifras, hospitales, líneas);
 * sismicidad es una serie de eventos de una fuente externa en vivo, con su
 * propio ciclo de vida (se actualiza sola, no depende de un PR).
 */
export interface SismicidadRepository {
  obtenerRecientes(): TE.TaskEither<SismicidadUsgsServiceException, Sismo[]>;
}
