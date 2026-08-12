import metaJson from "@/data/meta.json";
import departamentosJson from "@/data/departamentos.json";
import hospitalesJson from "@/data/hospitales.json";
import lineasJson from "@/data/lineas.json";
import apoyoPrivadoJson from "@/data/apoyo-privado.json";
import fuentesJson from "@/data/fuentes.json";
import acopioBogotaJson from "@/data/acopio-bogota.json";
import type {
  Meta,
  Departamento,
  Hospitales,
  LineaEmergencia,
  ApoyoPrivado,
  Fuente,
  AcopioBogota,
} from "@/lib/types";

// Todo el contenido dinámico del sitio vive en src/data/*.json.
// Actualizar estos archivos (vía Pull Request) actualiza el sitio en el
// siguiente despliegue — no requiere tocar componentes ni lógica.
// Ver 02_emphatize/DISENO_WEB.md, sección 6.

export const meta = metaJson as Meta;
export const departamentos = departamentosJson as Departamento[];
export const hospitales = hospitalesJson as Hospitales;
export const lineas = lineasJson as LineaEmergencia[];
export const apoyoPrivado = apoyoPrivadoJson as ApoyoPrivado[];
export const fuentes = fuentesJson as Fuente[];
export const acopioBogota = acopioBogotaJson as AcopioBogota;

export const departamentosPrioritarios = departamentos.filter((d) => d.prioridad);
export const departamentosSecundarios = departamentos.filter((d) => !d.prioridad);

export function getDepartamento(id: string): Departamento | undefined {
  return departamentos.find((d) => d.id === id);
}

/** Estado semántico agregado de un departamento, para tableros comparativos. */
export type EstadoSemantico = "critico" | "en-evaluacion" | "sin-datos";

export function getEstadoDepartamento(d: Departamento): EstadoSemantico {
  const fallecidos = d.cifras_capital?.fallecidos ?? d.cifras_departamento_ungrd.fallecidos;
  if (fallecidos == null) return "sin-datos";
  if (fallecidos > 0 || (d.cifras_capital?.desaparecidos ?? 0) > 0) return "critico";
  if (d.cifras_departamento_ungrd.viviendas_averiadas > 0) return "en-evaluacion";
  return "sin-datos";
}

/** Todos los albergues y puntos de acopio, agregados desde cada departamento. */
export function getAlberguesYAcopio() {
  return departamentos.flatMap((d) => [
    ...d.albergues.map((nombre) => ({ nombre, tipo: "Albergue temporal" as const, departamento: d.nombre })),
    ...d.puntos_acopio.map((nombre) => ({ nombre, tipo: "Punto de acopio" as const, departamento: d.nombre })),
  ]);
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

export function formatNumero(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("es-CO").format(n);
}
