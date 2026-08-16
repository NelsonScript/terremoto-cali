/**
 * Un hecho noticioso recopilado de prensa/fuentes oficiales por el agente de
 * clipping OSINT (tarea programada en la nube, cada 4h — ver
 * ARCHITECTURE_RULES.md §13). A diferencia de `evento` (cifras oficiales
 * consolidadas manualmente citando boletines de UNGRD), esto es información
 * de prensa NO oficial: útil porque se publica a diario aunque no esté
 * consolidada, pero siempre debe mostrarse como tal (`noOficial: true`).
 */
export interface NoticiaClip {
  id: string;
  titular: string;
  resumen: string;
  categoria:
    | 'fallecidos'
    | 'heridos'
    | 'albergues'
    | 'infraestructura'
    | 'ayuda-humanitaria'
    | 'vias-comunicacion'
    | 'salud'
    | 'otro';
  /** Uno de los 7 departamentos cubiertos por el sitio, o null si es nacional/varios. */
  departamento: string | null;
  municipio: string | null;
  /** ISO 8601 — cuándo la fuente original publicó la noticia (no cuándo el agente la recopiló). */
  fechaPublicacion: string;
  fuente: {
    nombre: string;
    url: string;
    tipo: 'medio' | 'oficial' | 'ong' | 'experto';
  };
  corroboracion: {
    nivel: 'multiple-fuentes' | 'fuente-unica';
    fuentesAdicionales: Array<{ nombre: string; url: string }>;
  };
  /** Cifras puntuales mencionadas en la nota, si las hay — nunca inferidas, solo las que el texto declara. */
  cifras: Array<{ etiqueta: string; valor: number; unidad: string }>;
  /** Siempre true — es una señal de prensa, no un boletín oficial de UNGRD/gobernación. */
  noOficial: true;
  /** Si esta noticia contradice otra ya publicada (cifras, hechos), se explica aquí en vez de elegir una. */
  notaAmbiguedad: string | null;
}
