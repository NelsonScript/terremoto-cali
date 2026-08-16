import { injectable } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import type { SismicidadRepository } from '@features/sismicidad/domain/sismicidad.repository';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';
import { RawSismosUsgsRespuestaSchema } from '@features/sismicidad/domain/schemas/sismo-usgs.schema';
import { mapearSismoUsgs } from '@features/sismicidad/domain/services/mapear-sismo-usgs.service';
import { SismicidadUsgsServiceException } from '@features/sismicidad/infraestructure/service/sismicidad-usgs.service.exception';

const USGS_FDSNWS_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

/**
 * Caja delimitadora que cubre Colombia y el occidente donde ocurrió el
 * evento (incluye margen para réplicas cercanas a la frontera). No es un
 * filtro administrativo por departamento — el USGS no conoce departamentos,
 * solo coordenadas.
 */
const CAJA_COLOMBIA = {
  minLatitude: -4.5,
  maxLatitude: 13,
  minLongitude: -79.5,
  maxLongitude: -66.5,
};

const VENTANA_DIAS = 30;
const MAGNITUD_MINIMA = 2.5;
const LIMITE_RESULTADOS = 30;

function construirUrl(): string {
  const desde = new Date(Date.now() - VENTANA_DIAS * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    format: 'geojson',
    starttime: desde.toISOString(),
    minmagnitude: String(MAGNITUD_MINIMA),
    minlatitude: String(CAJA_COLOMBIA.minLatitude),
    maxlatitude: String(CAJA_COLOMBIA.maxLatitude),
    minlongitude: String(CAJA_COLOMBIA.minLongitude),
    maxlongitude: String(CAJA_COLOMBIA.maxLongitude),
    orderby: 'time',
    limit: String(LIMITE_RESULTADOS),
  });
  return `${USGS_FDSNWS_URL}?${params.toString()}`;
}

/**
 * Implementación de `SismicidadRepository` sobre el API público FDSNWS del
 * USGS (earthquake.usgs.gov) — sin API key, CORS abierto, confirmado
 * funcional para la región de Colombia. Es la única fuente de sismicidad en
 * vivo integrada hasta ahora: se investigó el visor oficial del Servicio
 * Geológico Colombiano (SGC) y no se encontró un API público documentado
 * (ver ARCHITECTURE_RULES.md, sección de Sismicidad) — queda pendiente
 * si en el futuro se puede inspeccionar su tráfico real o publican uno.
 */
@injectable()
export class SismicidadUsgsService implements SismicidadRepository {
  obtenerRecientes(): TE.TaskEither<SismicidadUsgsServiceException, Sismo[]> {
    return TE.tryCatch(
      async () => {
        const respuesta = await fetch(construirUrl());
        if (!respuesta.ok) {
          throw new Error(`USGS respondió ${respuesta.status} ${respuesta.statusText}`);
        }
        const json: unknown = await respuesta.json();
        const validado = RawSismosUsgsRespuestaSchema.safeParse(json);
        if (!validado.success) {
          throw new Error(`Respuesta del USGS con forma inesperada: ${validado.error.message}`);
        }
        return validado.data.features.map(mapearSismoUsgs);
      },
      (error) => new SismicidadUsgsServiceException(this.obtenerRecientes.name, error)
    );
  }
}
