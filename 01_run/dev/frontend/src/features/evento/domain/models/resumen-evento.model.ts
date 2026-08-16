import type {
  Meta,
  Hospitales,
  LineaEmergencia,
  Fuente,
  ApoyoPrivado,
  AcopioBogota,
} from '@features/evento/domain/entities/evento';

/**
 * Modelo de lectura que expone el UseCase a la capa de Application/Redux.
 * No es la entidad de dominio "pura": es la composición de todo el estado
 * global del bounded context "evento" que necesita la app (home, salud,
 * líneas de emergencia, fuentes, apoyo privado, donar) — se resuelve en un
 * único fetch al montar la app para evitar loading states repetidos cuando
 * el usuario navega directo a una sub-página.
 */
export interface ResumenEventoModel {
  meta: Meta;
  hospitales: Hospitales;
  lineas: LineaEmergencia[];
  fuentes: Fuente[];
  apoyoPrivado: ApoyoPrivado[];
  acopioBogota: AcopioBogota;
}
