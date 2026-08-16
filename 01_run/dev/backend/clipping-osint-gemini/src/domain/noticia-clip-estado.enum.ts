/**
 * Estados del ciclo de vida de una noticia candidata dentro de una
 * ejecución del agente de clipping.
 *
 * CANDIDATA  -> recién extraída de la fuente (Gemini) y validada contra
 *               el esquema zod + invariantes de dominio (departamento
 *               cubierto).
 * VERIFICADA -> pasó el filtro de deduplicación (no repite una noticia
 *               ya publicada ni otra candidata de la misma tanda).
 * PUBLICADA  -> se persistió como documento nuevo en Firestore.
 * DESCARTADA -> no pasó algún filtro (duplicado, datos inválidos, etc).
 *               Estado terminal.
 */
export enum NoticiaClipEstado {
  CANDIDATA = 'CANDIDATA',
  VERIFICADA = 'VERIFICADA',
  PUBLICADA = 'PUBLICADA',
  DESCARTADA = 'DESCARTADA',
}
