import type * as TE from 'fp-ts/TaskEither';
import type {
  Meta,
  Hospitales,
  LineaEmergencia,
  Fuente,
  ApoyoPrivado,
  AcopioBogota,
} from '@features/evento/domain/entities/evento';
import type { EventoServiceException } from '@features/evento/infraestructure/service/evento-estatico.service.exception';
import type { ResumenEventoModel } from '@features/evento/domain/models/resumen-evento.model';

/**
 * Contrato del bounded context "evento": el estado agregado/global de la
 * emergencia (no específico de un departamento). Hoy lo implementa un
 * servicio que lee JSON estático versionado (ver infraestructure/); el día
 * que haya ingesta desde UNGRD/SGC/USGS, se agrega una nueva implementación
 * de esta misma interfaz y solo cambia el binding en evento.ioc.ts — el
 * resto de la app no se entera.
 */
export interface EventoRepository {
  obtenerResumen(): TE.TaskEither<EventoServiceException, ResumenEventoModel>;
  obtenerMeta(): TE.TaskEither<EventoServiceException, Meta>;
  obtenerHospitales(): TE.TaskEither<EventoServiceException, Hospitales>;
  obtenerLineas(): TE.TaskEither<EventoServiceException, LineaEmergencia[]>;
  obtenerFuentes(): TE.TaskEither<EventoServiceException, Fuente[]>;
  obtenerApoyoPrivado(): TE.TaskEither<EventoServiceException, ApoyoPrivado[]>;
  obtenerAcopioBogota(): TE.TaskEither<EventoServiceException, AcopioBogota>;
}
