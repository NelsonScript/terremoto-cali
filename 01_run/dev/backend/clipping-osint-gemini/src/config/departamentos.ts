/**
 * Los 7 departamentos que cubre el sitio "Ayuda Suroccidente".
 * Única fuente de verdad: la usan tanto el dominio (invariante de negocio
 * "solo aceptamos noticias de estos departamentos") como la construcción
 * del prompt de Gemini (infraestructura).
 */
export const DEPARTAMENTOS_CUBIERTOS = [
  'Valle del Cauca',
  'Risaralda',
  'Chocó',
  'Caldas',
  'Quindío',
  'Antioquia',
  'Tolima',
] as const;

export type DepartamentoCubierto = (typeof DEPARTAMENTOS_CUBIERTOS)[number];
