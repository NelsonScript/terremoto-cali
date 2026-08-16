import type { RawSismoUsgs } from '@features/sismicidad/domain/schemas/sismo-usgs.schema';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';

/**
 * Función pura de dominio: adapta el formato del USGS (ya validado por
 * `RawSismoUsgsSchema`) al modelo de dominio `Sismo`. Sin I/O — si mañana se
 * suma otra fuente, se agrega su propio `mapear-sismo-<fuente>.service.ts`
 * en vez de tocar este.
 */
export function mapearSismoUsgs(raw: RawSismoUsgs): Sismo {
  const [longitud, latitud, profundidadKm] = raw.geometry.coordinates;
  return {
    id: raw.id,
    magnitud: raw.properties.mag ?? 0,
    magnitudTipo: raw.properties.magType ?? 'desconocido',
    lugar: raw.properties.place ?? 'Ubicación no especificada',
    fechaHora: new Date(raw.properties.time).toISOString(),
    profundidadKm,
    latitud,
    longitud,
    alerta: raw.properties.alert ?? null,
    sentidoReportes: raw.properties.felt ?? null,
    urlDetalle: raw.properties.url,
  };
}
