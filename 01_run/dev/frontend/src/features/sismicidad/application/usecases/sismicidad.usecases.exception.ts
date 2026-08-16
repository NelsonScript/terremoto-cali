import { LayeredException } from '@shared/core/error/layered-exception';

export class SismicidadUseCasesException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('SismicidadUseCasesException', methodName, cause);
  }
}
