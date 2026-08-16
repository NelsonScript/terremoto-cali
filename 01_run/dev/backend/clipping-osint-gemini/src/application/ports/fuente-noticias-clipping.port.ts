import type { NoticiaExistente } from '../../domain/feed-noticias.repository';

export interface ParametrosBusquedaClipping {
  ultimasNoticias: NoticiaExistente[];
  ventana: { desde: Date; horas: number };
}

/**
 * Puerto que abstrae la fuente de candidatas de clipping. Hoy la
 * implementa Gemini (infraestructura); si mañana se agrega o se cambia
 * de proveedor de IA, solo se agrega/reemplaza el adaptador, sin tocar
 * el caso de uso.
 *
 * Devuelve JSON crudo (`unknown[]`), aún sin validar contra el esquema —
 * esa validación es responsabilidad explícita del caso de uso, para que
 * quede en un solo lugar el momento exacto en que "datos externos no
 * confiables" se convierten en "datos de dominio confiables".
 */
export interface IFuenteNoticiasClipping {
  buscarCandidatas(params: ParametrosBusquedaClipping): Promise<unknown[]>;
}
