import { injectable, inject } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { SISMICIDAD_IOC_TYPES } from '@features/sismicidad/application/container/sismicidad.ioc.types';
import type { SismicidadRepository } from '@features/sismicidad/domain/sismicidad.repository';
import type { Sismo } from '@features/sismicidad/domain/entities/sismo';
import { SismicidadUseCasesException } from '@features/sismicidad/application/usecases/sismicidad.usecases.exception';

@injectable()
export class SismicidadUseCases {
  constructor(@inject(SISMICIDAD_IOC_TYPES.SismicidadRepository) private readonly repository: SismicidadRepository) {}

  /** Sismos recientes en la región, más nuevo primero. */
  obtenerRecientes(): TE.TaskEither<SismicidadUseCasesException, Sismo[]> {
    return pipe(
      this.repository.obtenerRecientes(),
      TE.mapLeft((error) => new SismicidadUseCasesException(this.obtenerRecientes.name, error))
    );
  }
}
