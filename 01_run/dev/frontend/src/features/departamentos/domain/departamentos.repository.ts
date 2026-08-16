import type { Departamento } from '@features/departamentos/domain/entities/departamento';

/**
 * Contrato del bounded context "departamentos": la colección de
 * departamentos afectados y su detalle. Lecturas síncronas hoy (JSON
 * versionado); el contrato no cambiaría si mañana viene de una API.
 */
export interface DepartamentosRepository {
  listar(): Departamento[];
  listarPrioritarios(): Departamento[];
  listarSecundarios(): Departamento[];
  obtenerPorId(id: string): Departamento | undefined;
}
