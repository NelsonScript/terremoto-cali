import { Container } from 'inversify';
import { SISMICIDAD_IOC_TYPES } from '@features/sismicidad/application/container/sismicidad.ioc.types';
import type { SismicidadRepository } from '@features/sismicidad/domain/sismicidad.repository';
import { SismicidadUsgsService } from '@features/sismicidad/infraestructure/service/sismicidad-usgs.service';
import { SismicidadUseCases } from '@features/sismicidad/application/usecases/sismicidad.usecases';

const container = new Container();

container.bind<SismicidadRepository>(SISMICIDAD_IOC_TYPES.SismicidadRepository).to(SismicidadUsgsService);
container.bind<SismicidadUseCases>(SISMICIDAD_IOC_TYPES.SismicidadUseCases).to(SismicidadUseCases);

export { container as sismicidadContainer };
