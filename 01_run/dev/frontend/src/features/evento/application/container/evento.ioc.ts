import { Container } from 'inversify';
import { EVENTO_IOC_TYPES } from '@features/evento/application/container/evento.ioc.types';
import type { EventoRepository } from '@features/evento/domain/evento.repository';
import { EventoEstaticoService } from '@features/evento/infraestructure/service/evento-estatico.service';
import { EventoUseCases } from '@features/evento/application/usecases/evento.usecases';

const container = new Container();

container.bind<EventoRepository>(EVENTO_IOC_TYPES.EventoRepository).to(EventoEstaticoService);
container.bind<EventoUseCases>(EVENTO_IOC_TYPES.EventoUseCases).to(EventoUseCases);

export { container as eventoContainer };
