import { injectable, inject } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { VOLUNTARIADO_IOC_TYPES } from '@features/voluntariado/application/container/voluntariado.ioc.types';
import type { VoluntariadoRepository } from '@features/voluntariado/domain/voluntariado.repository';
import { VoluntarioSchema } from '@features/voluntariado/domain/schemas/voluntario.schema';
import { VoluntariadoUseCasesException } from '@features/voluntariado/application/usecases/voluntariado.usecases.exception';

@injectable()
export class VoluntariadoUseCases {
  constructor(@inject(VOLUNTARIADO_IOC_TYPES.VoluntariadoRepository) private readonly repository: VoluntariadoRepository) {}

  registrarVoluntario(entrada: unknown): TE.TaskEither<VoluntariadoUseCasesException, void> {
    const validado = VoluntarioSchema.safeParse(entrada);
    if (!validado.success) {
      return TE.left(new VoluntariadoUseCasesException(this.registrarVoluntario.name, validado.error));
    }
    return pipe(
      this.repository.registrar(validado.data),
      TE.mapLeft((error) => new VoluntariadoUseCasesException(this.registrarVoluntario.name, error))
    );
  }
}
