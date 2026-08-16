import { LayeredException } from '@shared/core/error/layered-exception';

export class SismicidadUsgsServiceException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('SismicidadUsgsServiceException', methodName, cause);
  }
}
