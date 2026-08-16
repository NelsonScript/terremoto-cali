import { z } from 'zod';

/**
 * COPIA SINCRONIZADA del schema de zod del frontend:
 *   frontend/src/features/feed-noticias/domain/schemas/noticia-clip.schema.ts
 *
 * Este backend está deliberadamente aislado del frontend (carpetas separadas,
 * sin workspace compartido — ver decisión del 14 ago), así que este archivo
 * es una copia, no un import compartido. Si el schema cambia en el frontend
 * (nuevo campo, nuevo enum, etc.), hay que actualizar este archivo a mano
 * para que sigan siendo el mismo contrato. El propósito de mirrorearlo aquí
 * (en vez de escribir una validación distinta a mano) es que lo que este
 * backend considera "válido para escribir" sea exactamente lo mismo que el
 * frontend considera "válido para leer" — cero posibilidad de que el backend
 * escriba algo que el frontend después descarte silenciosamente.
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
