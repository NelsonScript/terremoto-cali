/** Entidades del dominio "evento" — el estado agregado de la emergencia a nivel nacional. */

export interface CifraNacional {
  valor: number;
  etiqueta: string;
  nota?: string;
  fuente: string;
  corte: string;
}

export interface Meta {
  evento: string;
  epicentro: string;
  profundidad_km: number;
  hora_evento: string;
  declaratoria: string;
  region: string;
  ultima_actualizacion: string;
  fuente_principal: string;
  nacional: {
    fallecidos_confirmados_urbano: CifraNacional;
    fallecidos_gobernaciones: CifraNacional;
    heridos: CifraNacional;
  };
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

export interface Fuente {
  nombre: string;
  descripcion: string;
}

export interface ApoyoPrivado {
  organizacion: string;
  aporte: string;
  tipo: 'Sector privado' | 'Cooperación internacional' | 'Cooperación interinstitucional';
}

export interface AcopioBogota {
  horario_general: string;
  horario_sede_administrativa: string;
  puntos: { nombre: string; direccion: string; nota?: string }[];
  fuente: string;
  corte: string;
}
