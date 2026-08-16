import { Container } from 'inversify';
import { DEPARTAMENTOS_IOC_TYPES } from '@features/departamentos/application/container/departamentos.ioc.types';
import type { DepartamentosRepository } from '@features/departamentos/domain/departamentos.repository';
import { DepartamentosEstaticoService } from '@features/departamentos/infraestructure/service/departamentos-estatico.service';
import { DepartamentosUseCases } from '@features/departamentos/application/usecases/departamentos.usecases';

const container = new Container();

container.bind<DepartamentosRepository>(DEPARTAMENTOS_IOC_TYPES.DepartamentosRepository).to(DepartamentosEstaticoService);
container.bind<DepartamentosUseCases>(DEPARTAMENTOS_IOC_TYPES.DepartamentosUseCases).to(DepartamentosUseCases);

export { container as departamentosContainer };
