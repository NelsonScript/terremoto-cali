/**
 * Base para las excepciones de cada capa (Application/Infraestructure).
 * Cada capa define su propia subclase (ver ejemplos en features/*) pero
 * todas comparten el mismo formato de mensaje: permite reconocer de un
 * vistazo en los logs en qué capa y método ocurrió el fallo, y conserva
 * el error original como causa.
 */
export abstract class LayeredException extends Error {
  constructor(className: string, methodName: string, cause: unknown) {
    const message = `${className}.${methodName} :: ${cause instanceof Error ? cause.message : String(cause)}`;
    super(message);
    this.name = className;
    this.cause = cause;
  }
}
