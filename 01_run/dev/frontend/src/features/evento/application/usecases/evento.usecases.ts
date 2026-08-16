import { injectable, inject } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { EVENTO_IOC_TYPES } from '@features/evento/application/container/evento.ioc.types';
import type { EventoRepository } from '@features/evento/domain/evento.repository';
import type { ResumenEventoModel } from '@features/evento/domain/models/resumen-evento.model';
import { EventoUseCasesException } from '@features/evento/application/usecases/evento.usecases.exception';

@injectable()
export class EventoUseCases {
  constructor(@inject(EVENTO_IOC_TYPES.EventoRepository) private readonly repository: EventoRepository) {}

  /** Caso de uso de la pantalla de inicio: el resumen agregado del evento. */
  obtenerResumenNacional(): TE.TaskEither<EventoUseCasesException, ResumenEventoModel> {
    return pipe(
      this.repository.obtenerResumen(),
      TE.mapLeft((error) => new EventoUseCasesException(this.obtenerResumenNacional.name, error))
    );
  }
}
