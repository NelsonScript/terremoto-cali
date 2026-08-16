import type * as TE from 'fp-ts/TaskEither';
import type { ReporteInput } from '@features/reportes/domain/schemas/reporte.schema';
import type { ReportesServiceException } from '@features/reportes/infraestructure/service/reportes-firestore.service.exception';

/**
 * Contrato de persistencia de reportes. La cola de moderación (los reportes
 * NO son públicamente buscables hasta que el equipo coordinador los revise
 * — decisión ya tomada con el usuario) vive del lado del backend/reglas de
 * Firestore, no en esta interfaz: el repositorio solo sabe "crear".
 */
export interface ReportesRepository {
  crear(reporte: ReporteInput): TE.TaskEither<ReportesServiceException, void>;
}
