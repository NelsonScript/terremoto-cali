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
