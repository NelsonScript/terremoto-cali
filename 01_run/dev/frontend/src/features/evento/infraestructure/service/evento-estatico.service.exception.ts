import { LayeredException } from '@shared/core/error/layered-exception';

export class EventoServiceException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('EventoServiceException', methodName, cause);
  }
}
