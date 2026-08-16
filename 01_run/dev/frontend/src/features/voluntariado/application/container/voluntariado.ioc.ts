import { Container } from 'inversify';
import { VOLUNTARIADO_IOC_TYPES } from '@features/voluntariado/application/container/voluntariado.ioc.types';
import type { VoluntariadoRepository } from '@features/voluntariado/domain/voluntariado.repository';
import { VoluntariadoFirestoreService } from '@features/voluntariado/infraestructure/service/voluntariado-firestore.service';
import { VoluntariadoUseCases } from '@features/voluntariado/application/usecases/voluntariado.usecases';

const container = new Container();

container.bind<VoluntariadoRepository>(VOLUNTARIADO_IOC_TYPES.VoluntariadoRepository).to(VoluntariadoFirestoreService);
container.bind<VoluntariadoUseCases>(VOLUNTARIADO_IOC_TYPES.VoluntariadoUseCases).to(VoluntariadoUseCases);

export { container as voluntariadoContainer };
