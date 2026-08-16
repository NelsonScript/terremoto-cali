import { z } from 'zod';

export const VoluntarioSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
  perfil: z.string().min(1, { message: 'Selecciona un tipo de ayuda' }),
  departamento: z.string().min(1, { message: 'Selecciona un departamento' }),
  disponibilidad: z.union([z.string(), z.null()]),
  contacto: z.string().min(1, { message: 'El contacto es obligatorio' }),
});

export type VoluntarioInput = z.infer<typeof VoluntarioSchema>;
