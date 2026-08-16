/**
 * Excepción base para todas las excepciones de dominio del contexto Order.
 *
 * `errorCode` es un código de negocio estable (no cambia aunque cambie el
 * mensaje) que el `DomainExceptionFilter` de infraestructura usa para
 * construir la respuesta HTTP estandarizada.
 *
 * `httpStatusHint` es la sugerencia de status HTTP semántico asociada a la
 * excepción. El dominio NO conoce HTTP directamente (no importa nada de
 * @nestjs/common), pero sí puede declarar "esto es un caso de recurso no
 * encontrado" o "esto es una violación de regla de negocio" mediante este
 * campo numérico plano, que la capa de infraestructura traduce.
 */
export abstract class DomainException extends Error {
  abstract readonly errorCode: string;
  abstract readonly httpStatusHint: number;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
