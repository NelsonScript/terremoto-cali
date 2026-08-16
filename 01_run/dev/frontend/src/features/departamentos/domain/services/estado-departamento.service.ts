import type { Departamento } from '@features/departamentos/domain/entities/departamento';
import type { EstadoSemantico } from '@shared/components/estado-badge/estado-badge.types';

/**
 * Servicio de dominio: regla de negocio pura (sin I/O) que deriva el estado
 * semántico agregado de un departamento a partir de sus cifras. Vive en
 * `domain/services` porque no pertenece a ninguna entidad concreta ni
 * depende de infraestructura — es una regla del negocio en sí.
 */
export function getEstadoDepartamento(d: Departamento): EstadoSemantico {
  const fallecidos = d.cifras_capital?.fallecidos ?? d.cifras_departamento_ungrd.fallecidos;
  if (fallecidos == null) return 'sin-datos';
  if (fallecidos > 0 || (d.cifras_capital?.desaparecidos ?? 0) > 0) return 'critico';
  if (d.cifras_departamento_ungrd.viviendas_averiadas > 0) return 'en-evaluacion';
  return 'sin-datos';
}
