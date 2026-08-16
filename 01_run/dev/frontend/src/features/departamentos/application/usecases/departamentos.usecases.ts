import { injectable, inject } from 'inversify';
import { DEPARTAMENTOS_IOC_TYPES } from '@features/departamentos/application/container/departamentos.ioc.types';
import type { DepartamentosRepository } from '@features/departamentos/domain/departamentos.repository';
import type { Departamento } from '@features/departamentos/domain/entities/departamento';
import { getEstadoDepartamento } from '@features/departamentos/domain/services/estado-departamento.service';
import type { EstadoSemantico } from '@shared/components/estado-badge/estado-badge.types';

export interface AlbergueOAcopio {
  nombre: string;
  tipo: 'Albergue temporal' | 'Punto de acopio';
  departamento: string;
}

@injectable()
export class DepartamentosUseCases {
  constructor(
    @inject(DEPARTAMENTOS_IOC_TYPES.DepartamentosRepository) private readonly repository: DepartamentosRepository
  ) {}

  listarTodos(): Departamento[] {
    return [...this.repository.listarPrioritarios(), ...this.repository.listarSecundarios()];
  }

  listarPrioritarios(): Departamento[] {
    return this.repository.listarPrioritarios();
  }

  listarSecundarios(): Departamento[] {
    return this.repository.listarSecundarios();
  }

  obtenerPorId(id: string): Departamento | undefined {
    return this.repository.obtenerPorId(id);
  }

  estadoDe(departamento: Departamento): EstadoSemantico {
    return getEstadoDepartamento(departamento);
  }

  /** Agrega albergues y puntos de acopio de todos los departamentos. */
  listarAlberguesYAcopio(): AlbergueOAcopio[] {
    return this.repository.listar().flatMap((d) => [
      ...d.albergues.map((nombre) => ({ nombre, tipo: 'Albergue temporal' as const, departamento: d.nombre })),
      ...d.puntos_acopio.map((nombre) => ({ nombre, tipo: 'Punto de acopio' as const, departamento: d.nombre })),
    ]);
  }

  /** Departamentos con al menos una necesidad reportada (para la página de donación). */
  listarConNecesidades(): Departamento[] {
    return this.repository.listar().filter((d) => d.necesidades.length > 0);
  }
}
