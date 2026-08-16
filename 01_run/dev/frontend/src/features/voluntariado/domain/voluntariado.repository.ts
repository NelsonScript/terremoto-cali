import type * as TE from 'fp-ts/TaskEither';
import type { VoluntarioInput } from '@features/voluntariado/domain/schemas/voluntario.schema';
import type { VoluntariadoServiceException } from '@features/voluntariado/infraestructure/service/voluntariado-firestore.service.exception';

export interface VoluntariadoRepository {
  registrar(voluntario: VoluntarioInput): TE.TaskEither<VoluntariadoServiceException, void>;
}
