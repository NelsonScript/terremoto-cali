import type { RawNoticiaClip } from '@features/feed-noticias/domain/schemas/noticia-clip.schema';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';

/**
 * Función pura de dominio: adapta el documento crudo de Firestore (ya
 * validado por `RawNoticiaClipSchema`) al modelo de dominio `NoticiaClip`,
 * agregando el `id` del documento (que no viaja dentro de `data()`).
 */
export function mapearNoticiaClip(id: string, raw: RawNoticiaClip): NoticiaClip {
  return {
    id,
    titular: raw.titular,
    resumen: raw.resumen,
    categoria: raw.categoria,
    departamento: raw.departamento,
    municipio: raw.municipio,
    fechaPublicacion: raw.fechaPublicacion,
    fuente: raw.fuente,
    corroboracion: raw.corroboracion,
    cifras: raw.cifras,
    noOficial: raw.noOficial,
    notaAmbiguedad: raw.notaAmbiguedad,
  };
}
