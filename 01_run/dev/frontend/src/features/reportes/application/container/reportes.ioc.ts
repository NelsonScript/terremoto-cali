import { Container } from 'inversify';
import { REPORTES_IOC_TYPES } from '@features/reportes/application/container/reportes.ioc.types';
import type { ReportesRepository } from '@features/reportes/domain/reportes.repository';
import { ReportesFirestoreService } from '@features/reportes/infraestructure/service/reportes-firestore.service';
import { ReportesUseCases } from '@features/reportes/application/usecases/reportes.usecases';

const container = new Container();

container.bind<ReportesRepository>(REPORTES_IOC_TYPES.ReportesRepository).to(ReportesFirestoreService);
container.bind<ReportesUseCases>(REPORTES_IOC_TYPES.ReportesUseCases).to(ReportesUseCases);

export { container as reportesContainer };
