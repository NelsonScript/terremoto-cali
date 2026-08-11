import metaJson from "@/data/meta.json";
import cifrasJson from "@/data/cifras.json";
import zonasJson from "@/data/zonas.json";
import hospitalesJson from "@/data/hospitales.json";
import lineasJson from "@/data/lineas.json";
import albergesJson from "@/data/albergues.json";
import apoyoPrivadoJson from "@/data/apoyo-privado.json";
import fuentesJson from "@/data/fuentes.json";
import type {
  Meta,
  Cifras,
  Zona,
  Hospitales,
  LineaEmergencia,
  Albergue,
  ApoyoPrivado,
  Fuente,
} from "@/lib/types";

// Todo el contenido dinámico del sitio vive en src/data/*.json.
// Actualizar estos archivos (vía Pull Request) actualiza el sitio en el
// siguiente despliegue — no requiere tocar componentes ni lógica.
// Ver 02_emphatize/DISENO_WEB.md, sección 6.

export const meta = metaJson as Meta;
export const cifras = cifrasJson as Cifras;
export const zonas = zonasJson as Zona[];
export const hospitales = hospitalesJson as Hospitales;
export const lineas = lineasJson as LineaEmergencia[];
export const albergues = albergesJson as Albergue[];
export const apoyoPrivado = apoyoPrivadoJson as ApoyoPrivado[];
export const fuentes = fuentesJson as Fuente[];

export function getZona(id: string): Zona | undefined {
  return zonas.find((z) => z.id === id);
}

export function getCifraZona(id: string) {
  return cifras.zonas.find((z) => z.id === id);
}

export function formatFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
