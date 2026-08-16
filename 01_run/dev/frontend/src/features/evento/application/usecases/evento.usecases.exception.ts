import { LayeredException } from '@shared/core/error/layered-exception';

export class EventoUseCasesException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('EventoUseCasesException', methodName, cause);
  }
}
