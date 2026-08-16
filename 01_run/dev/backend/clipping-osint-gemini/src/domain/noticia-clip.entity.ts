import type { RawNoticiaClip } from '../schemas/noticia-clip.schema';
import { NoticiaClipEstado } from './noticia-clip-estado.enum';
import { NoticiaClipState } from './states/noticia-clip-state.interface';
import { CandidataState } from './states/candidata.state';
import { NoticiaClipEstadoCambiadoEvent } from './events/noticia-clip-estado-cambiado.event';
import { DatosInvalidosException } from './exceptions/datos-invalidos.exception';

/**
 * NoticiaClip — entidad de dominio. Representa una noticia candidata a lo
 * largo de una ejecución del agente de clipping: desde que Gemini la
 * propone hasta que se descarta o se publica en Firestore.
 *
 * TypeScript puro: no conoce Firestore, Gemini, ni ningún detalle de
 * infraestructura. Delega las reglas de transición en el patrón State.
 */
export class NoticiaClip {
  private estadoActual: NoticiaClipEstado;
  private estadoActivo: NoticiaClipState;
  private idDocumento: string | null = null;
  private motivosDescarteInterno: string[] | null = null;
  private readonly eventos: NoticiaClipEstadoCambiadoEvent[] = [];

  private constructor(private readonly datos: RawNoticiaClip) {
    this.estadoActual = NoticiaClipEstado.CANDIDATA;
    this.estadoActivo = new CandidataState();
  }

  /**
   * Construye una NoticiaClip a partir de datos ya validados contra el
   * esquema zod (`RawNoticiaClipSchema`), aplicando además la invariante
   * de negocio "el departamento debe ser uno de los cubiertos por el
   * sitio, o null para nacional/varios".
   */
  static crear(datos: RawNoticiaClip, departamentosCubiertos: readonly string[]): NoticiaClip {
    if (datos.departamento !== null && !departamentosCubiertos.includes(datos.departamento)) {
      throw new DatosInvalidosException(
        `departamento fuera de los ${departamentosCubiertos.length} cubiertos: ${datos.departamento}`,
      );
    }
    return new NoticiaClip(datos);
  }

  aprobar(): void {
    this.estadoActivo.aprobar(this);
  }

  descartar(motivos: string[]): void {
    this.estadoActivo.descartar(this, motivos);
  }

  publicar(idDocumento: string): void {
    this.estadoActivo.publicar(this, idDocumento);
  }

  /**
   * Usado EXCLUSIVAMENTE por las clases NoticiaClipState para aplicar una
   * transición ya validada y registrar el evento de dominio.
   */
  transicionarA(
    nuevoEstado: NoticiaClipEstado,
    nuevaState: NoticiaClipState,
    extra?: { motivos?: string[]; idDocumento?: string },
  ): void {
    const anterior = this.estadoActual;
    this.estadoActual = nuevoEstado;
    this.estadoActivo = nuevaState;
    if (extra?.motivos) this.motivosDescarteInterno = extra.motivos;
    if (extra?.idDocumento) this.idDocumento = extra.idDocumento;

    this.eventos.push(
      new NoticiaClipEstadoCambiadoEvent(this.datos.titular, anterior, nuevoEstado, new Date(), extra?.motivos),
    );
  }

  /** Extrae y limpia los eventos de dominio acumulados (equivalente a `commit()`). */
  pullEventos(): NoticiaClipEstadoCambiadoEvent[] {
    const eventos = [...this.eventos];
    this.eventos.length = 0;
    return eventos;
  }

  get titular(): string {
    return this.datos.titular;
  }

  get estado(): NoticiaClipEstado {
    return this.estadoActual;
  }

  get id(): string | null {
    return this.idDocumento;
  }

  get motivosDescarte(): string[] | null {
    return this.motivosDescarteInterno;
  }

  /** Datos planos listos para persistir (el repositorio de infraestructura los usa tal cual). */
  get datosParaPersistir(): RawNoticiaClip {
    return this.datos;
  }
}
