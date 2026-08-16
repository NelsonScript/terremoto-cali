import { z } from 'zod';

/**
 * Validación del documento CRUDO tal como viene de Firestore, antes de que
 * toque cualquier otra capa. `feed_noticias` no lo escribe un formulario
 * controlado por nuestro propio código en el momento de lectura — lo escribe
 * un agente autónomo (LLM + búsqueda web) en una ejecución separada, sin
 * supervisión humana por documento. Aunque las reglas de Firestore (ver
 * `firestore.rules`, función `esNoticiaClipValida`) ya validan la forma al
 * escribir, se vuelve a validar acá con el mismo criterio que
 * `sismicidad` aplica a un API de un tercero real: no confiar en la forma de
 * un dato que no se originó en un flujo síncrono propio del cliente.
 */
const FuenteSchema = z.object({
  nombre: z.string().min(1),
  url: z.preprocess(
    (val) => (typeof val === 'string' && !val.startsWith('http://') && !val.startsWith('https://') ? `https://${val}` : val),
    z.string().url()
  ),
  tipo: z.enum(['medio', 'oficial', 'ong', 'experto']),
});

const CorroboracionSchema = z.object({
  nivel: z.enum(['multiple-fuentes', 'fuente-unica']),
  fuentesAdicionales: z.preprocess(
    (val) => (Array.isArray(val) ? val : []),
    z.array(z.object({ nombre: z.string(), url: z.string() }))
  ).default([]),
});

const CifraSchema = z.object({
  etiqueta: z.string(),
  valor: z.number(),
  unidad: z.string(),
});

export const CategoriaNoticiaSchema = z.enum([
  'fallecidos',
  'heridos',
  'albergues',
  'infraestructura',
  'ayuda-humanitaria',
  'vias-comunicacion',
  'salud',
  'otro',
]);

export const RawNoticiaClipSchema = z.object({
  titular: z.string().min(1),
  resumen: z.string().min(1),
  categoria: CategoriaNoticiaSchema,
  departamento: z.string().nullable().default(null),
  municipio: z.string().nullable().default(null),
  fechaPublicacion: z.preprocess((val) => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && 'toDate' in val && typeof (val as any).toDate === 'function') {
      return (val as any).toDate().toISOString();
    }
    if (val && typeof val === 'object' && 'seconds' in val) {
      return new Date((val as any).seconds * 1000).toISOString();
    }
    if (val instanceof Date) return val.toISOString();
    return String(val);
  }, z.string()),
  fuente: FuenteSchema,
  corroboracion: CorroboracionSchema,
  cifras: z.preprocess((val) => (Array.isArray(val) ? val : []), z.array(CifraSchema)).default([]),
  noOficial: z.literal(true),
  notaAmbiguedad: z.string().nullable().default(null),
  creadoPor: z.string().optional(),
});

export type RawNoticiaClip = z.infer<typeof RawNoticiaClipSchema>;
