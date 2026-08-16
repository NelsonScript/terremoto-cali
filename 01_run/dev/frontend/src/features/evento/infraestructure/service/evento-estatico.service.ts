import { injectable } from 'inversify';
import * as TE from 'fp-ts/TaskEither';
import type { EventoRepository } from '@features/evento/domain/evento.repository';
import type { ResumenEventoModel } from '@features/evento/domain/models/resumen-evento.model';
import type {
  Meta,
  Hospitales,
  LineaEmergencia,
  Fuente,
  ApoyoPrivado,
  AcopioBogota,
} from '@features/evento/domain/entities/evento';
import { EventoServiceException } from '@features/evento/infraestructure/service/evento-estatico.service.exception';

import metaJson from '@data/meta.json';
import hospitalesJson from '@data/hospitales.json';
import lineasJson from '@data/lineas.json';
import fuentesJson from '@data/fuentes.json';
import apoyoPrivadoJson from '@data/apoyo-privado.json';
import acopioBogotaJson from '@data/acopio-bogota.json';

const meta = metaJson as Meta;
const hospitales = hospitalesJson as Hospitales;
const lineas = lineasJson as LineaEmergencia[];
const fuentes = fuentesJson as Fuente[];
const apoyoPrivado = apoyoPrivadoJson as ApoyoPrivado[];
const acopioBogota = acopioBogotaJson as AcopioBogota;

/**
 * Implementación de EventoRepository respaldada por los JSON versionados en
 * src/data/ (actualizados vía Pull Request, nunca por escritura en runtime).
 * Se modela como asíncrona (TE.tryCatch) aunque hoy sea una lectura
 * síncrona en memoria: así el contrato no cambia el día que se reemplace
 * por una llamada real a UNGRD/SGC/USGS.
 */
@injectable()
export class EventoEstaticoService implements EventoRepository {
  obtenerResumen(): TE.TaskEither<EventoServiceException, ResumenEventoModel> {
    return TE.tryCatch(
      () => Promise.resolve({ meta, hospitales, lineas, fuentes, apoyoPrivado, acopioBogota }),
      (error) => new EventoServiceException(this.obtenerResumen.name, error)
    );
  }

  obtenerMeta(): TE.TaskEither<EventoServiceException, Meta> {
    return TE.tryCatch(
      () => Promise.resolve(meta),
      (error) => new EventoServiceException(this.obtenerMeta.name, error)
    );
  }

  obtenerHospitales(): TE.TaskEither<EventoServiceException, Hospitales> {
    return TE.tryCatch(
      () => Promise.resolve(hospitales),
      (error) => new EventoServiceException(this.obtenerHospitales.name, error)
    );
  }

  obtenerLineas(): TE.TaskEither<EventoServiceException, LineaEmergencia[]> {
    return TE.tryCatch(
      () => Promise.resolve(lineas),
      (error) => new EventoServiceException(this.obtenerLineas.name, error)
    );
  }

  obtenerFuentes(): TE.TaskEither<EventoServiceException, Fuente[]> {
    return TE.tryCatch(
      () => Promise.resolve(fuentes),
      (error) => new EventoServiceException(this.obtenerFuentes.name, error)
    );
  }

  obtenerApoyoPrivado(): TE.TaskEither<EventoServiceException, ApoyoPrivado[]> {
    return TE.tryCatch(
      () => Promise.resolve(apoyoPrivado),
      (error) => new EventoServiceException(this.obtenerApoyoPrivado.name, error)
    );
  }

  obtenerAcopioBogota(): TE.TaskEither<EventoServiceException, AcopioBogota> {
    return TE.tryCatch(
      () => Promise.resolve(acopioBogota),
      (error) => new EventoServiceException(this.obtenerAcopioBogota.name, error)
    );
  }
}
