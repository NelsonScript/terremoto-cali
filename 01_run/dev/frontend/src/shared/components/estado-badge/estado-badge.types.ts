/**
 * Estado semántico agregado genérico (crítico / en evaluación / sin datos).
 * Vive en `shared` porque es un concepto de presentación reutilizable por
 * cualquier feature (departamentos, salud, albergues…), no propiedad de un
 * solo dominio.
 */
export type EstadoSemantico = 'critico' | 'en-evaluacion' | 'sin-datos';
