/** Utilidades de formato puramente presentacionales — sin reglas de negocio. */

export function formatFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatNumero(n: number | null | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('es-CO').format(n);
}

/** "hace 3 min", "hace 2 h" — para datos que se refrescan solos (ej. sismicidad en vivo). */
export function formatTiempoRelativo(iso: string, ahora: number = Date.now()): string {
  const diffMs = ahora - new Date(iso).getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return 'justo ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `hace ${dias} d`;
}
