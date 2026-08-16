import { z } from 'zod';

/**
 * Validación de negocio del reporte antes de tocar infraestructura. Vive en
 * Domain porque es una regla del dominio ("un reporte necesita
 * descripción"), no un detalle de Firestore.
 */
export const ReporteSchema = z.object({
  tipo: z.string().min(1, { message: 'Selecciona un tipo de reporte' }),
  departamento: z.string().min(1, { message: 'Selecciona un departamento' }),
  municipio: z.union([z.string(), z.null()]),
  descripcion: z.string().min(1, { message: 'La descripción es obligatoria' }),
  ubicacion: z.union([z.string(), z.null()]),
  contacto: z.union([z.string(), z.null()]),
});

export type ReporteInput = z.infer<typeof ReporteSchema>;
