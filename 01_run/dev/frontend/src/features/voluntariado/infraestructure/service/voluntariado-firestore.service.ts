import { injectable } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@shared/core/persistence/firebase';
import type { VoluntariadoRepository } from '@features/voluntariado/domain/voluntariado.repository';
import type { VoluntarioInput } from '@features/voluntariado/domain/schemas/voluntario.schema';
import { VoluntariadoServiceException } from '@features/voluntariado/infraestructure/service/voluntariado-firestore.service.exception';

@injectable()
export class VoluntariadoFirestoreService implements VoluntariadoRepository {
  registrar(voluntario: VoluntarioInput): TE.TaskEither<VoluntariadoServiceException, void> {
    return TE.tryCatch(
      async () => {
        await addDoc(collection(getDb(), 'voluntariado'), {
          ...voluntario,
          creadoEn: serverTimestamp(),
        });
      },
      (error) => new VoluntariadoServiceException(this.registrar.name, error)
    );
  }
}
