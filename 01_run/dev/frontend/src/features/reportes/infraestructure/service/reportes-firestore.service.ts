import { injectable } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from '@shared/core/persistence/firebase';
import type { ReportesRepository } from '@features/reportes/domain/reportes.repository';
import type { ReporteInput } from '@features/reportes/domain/schemas/reporte.schema';
import { ReportesServiceException } from '@features/reportes/infraestructure/service/reportes-firestore.service.exception';

/**
 * Implementación de ReportesRepository sobre Firestore, protegida por
 * reglas de "solo creación" (ver 03_architecture/firestore.rules): no hay
 * lectura pública, solo el equipo coordinador consulta desde la consola.
 */
@injectable()
export class ReportesFirestoreService implements ReportesRepository {
  crear(reporte: ReporteInput): TE.TaskEither<ReportesServiceException, void> {
    return TE.tryCatch(
      async () => {
        await addDoc(collection(getDb(), 'reportes'), {
          ...reporte,
          creadoEn: serverTimestamp(),
        });
      },
      (error) => new ReportesServiceException(this.crear.name, error)
    );
  }
}
