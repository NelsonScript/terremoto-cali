import { z } from 'zod';

/**
 * Validación del payload CRUDO del API del USGS (GeoJSON) antes de que toque
 * cualquier otra capa. Es el primer feature del proyecto que consume una API
 * externa real: el contrato de un tercero puede cambiar sin aviso, así que
 * no se confía en su forma — si no valida, se trata como un fallo de
 * Infraestructura (ver `SismicidadUsgsServiceException`), nunca como un dato
 * parcial silencioso.
 */
const RawSismoUsgsGeometrySchema = z.object({
  type: z.literal('Point'),
  // GeoJSON: [longitud, latitud, profundidad_km]
  coordinates: z.tuple([z.number(), z.number(), z.number()]),
});

const RawSismoUsgsPropertiesSchema = z.object({
  mag: z.number().nullable(),
  place: z.string().nullable(),
  time: z.number(),
  magType: z.string().nullable(),
  alert: z.enum(['green', 'yellow', 'orange', 'red']).nullable().optional(),
  felt: z.number().nullable().optional(),
  url: z.string(),
});

export const RawSismoUsgsSchema = z.object({
  id: z.string(),
  geometry: RawSismoUsgsGeometrySchema,
  properties: RawSismoUsgsPropertiesSchema,
});

export const RawSismosUsgsRespuestaSchema = z.object({
  features: z.array(RawSismoUsgsSchema),
});

export type RawSismoUsgs = z.infer<typeof RawSismoUsgsSchema>;
