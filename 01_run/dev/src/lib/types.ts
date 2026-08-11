export interface Meta {
  evento: string;
  epicentro: string;
  profundidad_km: number;
  declaratoria: string;
  ultima_actualizacion: string;
  fuente_principal: string;
}

export interface CifraZona {
  id: string;
  nombre: string;
  fallecidos: number | null;
  heridos: number | null;
  desaparecidos: number | null;
  rescatados: number | null;
  edificaciones_colapsadas: string | null;
  nota?: string;
  fuente: string;
  corte: string;
}

export interface Cifras {
  nacional: {
    fallecidos: number;
    nota: string;
    fuente: string;
    corte: string;
  };
  zonas: CifraZona[];
}

export interface Zona {
  id: string;
  nombre: string;
  region: string;
  resumen: string;
  situacion: string[];
  necesidades: string[];
  puntos_acopio: string[];
  albergues: string[];
}

export interface InstitucionSalud {
  nombre: string;
  ciudad: string;
  estado: string;
  detalle: string;
}

export interface Hospitales {
  resumen_por_ciudad: { ciudad: string; dano_grave_evacuadas: number; en_evaluacion_saturadas: number; total: number }[];
  instituciones: InstitucionSalud[];
  necesidades_urgentes: { zona: string; necesidad: string; responsable: string }[];
  fuente: string;
  corte: string;
}

export interface LineaEmergencia {
  nombre: string;
  numero: string;
  cobertura: string;
  nota?: string;
}

export interface Albergue {
  nombre: string;
  zona: string;
  tipo: "Albergue temporal" | "Punto de acopio";
  direccion: string;
  estado: string;
}

export interface ApoyoPrivado {
  organizacion: string;
  aporte: string;
}

export interface Fuente {
  nombre: string;
  descripcion: string;
}
