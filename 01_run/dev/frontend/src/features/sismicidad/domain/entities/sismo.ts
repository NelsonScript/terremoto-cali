/**
 * Modelo de dominio de un evento sísmico — independiente de la fuente que lo
 * origina. Hoy la única implementación de `SismicidadRepository` lo llena
 * desde la API pública del USGS (ver infraestructure/), pero cualquier otra
 * fuente (ej. si el SGC publica un API oficial en el futuro) solo necesita
 * mapear a esta misma forma; el resto de la app no se entera del cambio.
 */
export interface Sismo {
  id: string;
  magnitud: number;
  magnitudTipo: string;
  lugar: string;
  /** ISO 8601, UTC. */
  fechaHora: string;
  profundidadKm: number;
  latitud: number;
  longitud: number;
  /** Nivel de alerta de impacto humanitario (PAGER). Casi siempre null salvo sismos muy significativos. */
  alerta: 'green' | 'yellow' | 'orange' | 'red' | null;
  /** Número de reportes "lo sentí" recibidos, si hay alguno. */
  sentidoReportes: number | null;
  urlDetalle: string;
}
