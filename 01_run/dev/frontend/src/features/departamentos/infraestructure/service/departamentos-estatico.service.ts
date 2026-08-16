import { injectable } from 'inversify';
import type { DepartamentosRepository } from '@features/departamentos/domain/departamentos.repository';
import type { Departamento } from '@features/departamentos/domain/entities/departamento';
import departamentosJson from '@data/departamentos.json';

const departamentos = departamentosJson as Departamento[];

@injectable()
export class DepartamentosEstaticoService implements DepartamentosRepository {
  listar(): Departamento[] {
    return departamentos;
  }

  listarPrioritarios(): Departamento[] {
    return departamentos.filter((d) => d.prioridad);
  }

  listarSecundarios(): Departamento[] {
    return departamentos.filter((d) => !d.prioridad);
  }

  obtenerPorId(id: string): Departamento | undefined {
    return departamentos.find((d) => d.id === id);
  }
}
