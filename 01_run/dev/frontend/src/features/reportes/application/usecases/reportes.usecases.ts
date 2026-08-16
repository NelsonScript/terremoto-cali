import { injectable, inject } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { REPORTES_IOC_TYPES } from '@features/reportes/application/container/reportes.ioc.types';
import type { ReportesRepository } from '@features/reportes/domain/reportes.repository';
import { ReporteSchema, type ReporteInput } from '@features/reportes/domain/schemas/reporte.schema';
import { ReportesUseCasesException } from '@features/reportes/application/usecases/reportes.usecases.exception';

@injectable()
export class ReportesUseCases {
  constructor(@inject(REPORTES_IOC_TYPES.ReportesRepository) private readonly repository: ReportesRepository) {}

  enviarReporte(entrada: unknown): TE.TaskEither<ReportesUseCasesException, void> {
    const validado = ReporteSchema.safeParse(entrada);
    if (!validado.success) {
      return TE.left(new ReportesUseCasesException(this.enviarReporte.name, validado.error));
    }
    const reporte: ReporteInput = validado.data;
    return pipe(
      this.repository.crear(reporte),
      TE.mapLeft((error) => new ReportesUseCasesException(this.enviarReporte.name, error))
    );
  }
}
