import type { NoticiaExistente } from '../../domain/feed-noticias.repository';

/**
 * Calcula la ventana de tiempo que debe cubrir la búsqueda de esta
 * ejecución: desde la publicación más reciente conocida (si fue hace
 * menos de `horasDefecto`) o, si no, una ventana fija hacia atrás.
 *
 * Lógica idéntica a la del script original — solo se movió a un servicio
 * de aplicación puro para que sea testeable de forma aislada.
 */
export function calcularVentanaBusqueda(
  ultimasNoticias: NoticiaExistente[],
  horasDefecto: number,
): { desde: Date; horas: number } {
  const ahora = Date.now();

  if (!ultimasNoticias.length || !ultimasNoticias[0].fechaPublicacion) {
    return { desde: new Date(ahora - horasDefecto * 3600 * 1000), horas: horasDefecto };
  }

  const masReciente = new Date(ultimasNoticias[0].fechaPublicacion).getTime();
  const horasDesdeUltima = (ahora - masReciente) / 3600 / 1000;

  if (horasDesdeUltima < horasDefecto) {
    return { desde: new Date(masReciente), horas: Math.max(horasDesdeUltima, 0.5) };
  }

  return { desde: new Date(ahora - horasDefecto * 3600 * 1000), horas: horasDefecto };
}
