/**
 * Excepción base de dominio. TypeScript puro — sin dependencias de
 * frameworks ni de infraestructura (Firestore, Gemini, etc).
 */
export abstract class DomainException extends Error {
  abstract readonly errorCode: string;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
