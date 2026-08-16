import { NoticiaClipEstado } from '../noticia-clip-estado.enum';

/**
 * Evento de dominio: se registra en CADA transición exitosa de la
 * máquina de estados de NoticiaClip. No depende de ningún bus externo —
 * la capa de aplicación decide qué hacer con los eventos acumulados
 * (hoy: logging de diagnóstico vía console.debug, ver el caso de uso).
 */
export class NoticiaClipEstadoCambiadoEvent {
  constructor(
    readonly titular: string,
    readonly estadoAnterior: NoticiaClipEstado,
    readonly estadoNuevo: NoticiaClipEstado,
    readonly occurredAt: Date,
    readonly motivos?: string[],
  ) {}
}
