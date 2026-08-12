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

export interface CifraNacional {
  valor: number;
  etiqueta: string;
  nota?: string;
  fuente: string;
  corte: string;
}

export interface CifrasCapital {
  nombre: string;
  fallecidos?: number;
  heridos?: number;
  desaparecidos?: number;
  atrapados?: number;
  rescatados?: number;
  estructuras_colapsadas?: number;
  edificios_dano_estructural?: number;
  ips_inhabilitadas?: number;
  viviendas_colapsadas?: number;
  viviendas_averiadas?: number;
  damnificados?: number;
  fuente: string;
  corte: string;
  nota?: string;
}

export interface CifrasDepartamentoUngrd {
  fallecidos: number;
  heridos: number;
  viviendas_averiadas: number;
  viviendas_destruidas: number;
  edificios_colapsados: number;
  centros_asistenciales_afectados?: number;
  fuente: string;
  corte: string;
  nota_ambiguedad?: string;
}

export interface Municipio {
  nombre: string;
  nota: string;
}

export interface Departamento {
  id: string;
  nombre: string;
  capital: string;
  prioridad: boolean;
  resumen: string;
  cifras_capital?: CifrasCapital;
  cifras_departamento_ungrd: CifrasDepartamentoUngrd;
  situacion: string[];
  municipios: Municipio[];
  necesidades: string[];
  puntos_acopio: string[];
  albergues: string[];
  nota_cobertura?: string;
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

export interface ApoyoPrivado {
  organizacion: string;
  aporte: string;
  tipo: "Sector privado" | "Cooperación internacional" | "Cooperación interinstitucional";
}

export interface Fuente {
  nombre: string;
  descripcion: string;
}

export interface AcopioBogota {
  horario_general: string;
  horario_sede_administrativa: string;
  puntos: { nombre: string; direccion: string; nota?: string }[];
  fuente: string;
  corte: string;
}
