import type { RawNoticiaClip } from '../../schemas/noticia-clip.schema';

/**
 * Deduplicación por URL exacta de fuente o por similitud de titular
 * (Jaccard sobre palabras normalizadas). Lógica idéntica a la del script
 * original, movida a un servicio de aplicación puro y testeable.
 */
export function normalizarTitular(t: string): string[] {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export function esDuplicado(
  candidata: RawNoticiaClip,
  existentes: Array<{ titular?: string; fuente?: { url?: string } }>,
): boolean {
  const palabrasCandidata = new Set(normalizarTitular(candidata.titular));

  for (const ex of existentes) {
    if (ex.fuente?.url && candidata.fuente.url && ex.fuente.url === candidata.fuente.url) {
      return true;
    }

    const palabrasEx = new Set(normalizarTitular(ex.titular || ''));
    const interseccion = [...palabrasCandidata].filter((w) => palabrasEx.has(w)).length;
    const union = new Set([...palabrasCandidata, ...palabrasEx]).size;
    const jaccard = union ? interseccion / union : 0;

    if (jaccard > 0.6) {
      return true;
    }
  }

  return false;
}
