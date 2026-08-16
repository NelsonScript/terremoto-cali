import { RawNoticiaClipSchema, type RawNoticiaClip } from '../../schemas/noticia-clip.schema';
import { NoticiaClip } from '../../domain/noticia-clip.entity';
import type { IFeedNoticiasRepository } from '../../domain/feed-noticias.repository';
import { DatosInvalidosException } from '../../domain/exceptions/datos-invalidos.exception';
import type { NoticiaClipEstadoCambiadoEvent } from '../../domain/events/noticia-clip-estado-cambiado.event';
import type { IFuenteNoticiasClipping } from '../ports/fuente-noticias-clipping.port';
import { calcularVentanaBusqueda } from '../services/calcular-ventana-busqueda.service';
import { esDuplicado } from '../services/detectar-duplicado.service';

export interface ResumenClipping {
  candidatas: number;
  creadas: number;
  descartadas: number;
  detalle_creadas: Array<{ id: string; titular: string }>;
  detalle_descartadas: Array<{ titular: string; motivos: string[] }>;
}

/**
 * Caso de uso único de este backend: buscar candidatas de noticias,
 * verificarlas (esquema + invariantes de dominio + deduplicación) y
 * publicar en Firestore las que pasan el filtro.
 *
 * Orquesta el dominio (NoticiaClip + máquina de estados) y los puertos
 * (repositorio del feed, fuente de clipping) sin conocer Firestore ni
 * Gemini directamente — eso vive en infraestructura.
 */
export class ClipearYPublicarNoticiasUseCase {
  constructor(
    private readonly repositorio: IFeedNoticiasRepository,
    private readonly fuente: IFuenteNoticiasClipping,
    private readonly departamentosCubiertos: readonly string[],
    private readonly ventanaHorasDefecto: number,
    /** Hook opcional para observar los eventos de dominio (por defecto, log de diagnóstico). */
    private readonly registrarEventos: (eventos: NoticiaClipEstadoCambiadoEvent[]) => void = (eventos) => {
      for (const evento of eventos) {
        console.debug(
          `[NoticiaClipEstadoCambiado] "${evento.titular}" ${evento.estadoAnterior} -> ${evento.estadoNuevo}` +
            (evento.motivos ? ` (${evento.motivos.join('; ')})` : ''),
        );
      }
    },
  ) {}

  async ejecutar(): Promise<ResumenClipping> {
    const ultimasNoticias = await this.repositorio.buscarUltimas(12);
    const ventana = calcularVentanaBusqueda(ultimasNoticias, this.ventanaHorasDefecto);

    const crudo = await this.fuente.buscarCandidatas({ ultimasNoticias, ventana });
    if (!Array.isArray(crudo)) {
      throw new Error('La fuente de clipping no devolvió un array.');
    }

    const aprobadas: NoticiaClip[] = [];
    const datosAprobados: RawNoticiaClip[] = [];
    const descartadas: Array<{ titular: string; motivos: string[] }> = [];

    for (const candidataCruda of crudo) {
      const resultado = RawNoticiaClipSchema.safeParse(candidataCruda);
      if (!resultado.success) {
        const titular =
          typeof (candidataCruda as Record<string, unknown>)?.titular === 'string'
            ? (candidataCruda as Record<string, string>).titular
            : '(sin titular)';
        descartadas.push({
          titular,
          motivos: resultado.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
        });
        continue;
      }

      const datosValidados = resultado.data;
      let noticia: NoticiaClip;
      try {
        noticia = NoticiaClip.crear(datosValidados, this.departamentosCubiertos);
      } catch (error) {
        if (error instanceof DatosInvalidosException) {
          descartadas.push({ titular: datosValidados.titular, motivos: [error.message] });
          continue;
        }
        throw error;
      }

      if (esDuplicado(datosValidados, ultimasNoticias) || esDuplicado(datosValidados, datosAprobados)) {
        noticia.descartar(['posible duplicado de una noticia ya publicada']);
        descartadas.push({ titular: noticia.titular, motivos: noticia.motivosDescarte ?? [] });
        this.registrarEventos(noticia.pullEventos());
        continue;
      }

      noticia.aprobar();
      this.registrarEventos(noticia.pullEventos());
      aprobadas.push(noticia);
      datosAprobados.push(datosValidados);
    }

    const creadas: Array<{ id: string; titular: string }> = [];
    for (const noticia of aprobadas) {
      const id = await this.repositorio.guardar(noticia);
      noticia.publicar(id);
      this.registrarEventos(noticia.pullEventos());
      creadas.push({ id, titular: noticia.titular });
    }

    return {
      candidatas: crudo.length,
      creadas: creadas.length,
      descartadas: descartadas.length,
      detalle_creadas: creadas,
      detalle_descartadas: descartadas,
    };
  }
}
