import { LayeredException } from '@shared/core/error/layered-exception';

export class VoluntariadoUseCasesException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('VoluntariadoUseCasesException', methodName, cause);
  }
}
