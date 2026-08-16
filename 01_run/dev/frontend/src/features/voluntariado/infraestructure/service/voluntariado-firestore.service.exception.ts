import { LayeredException } from '@shared/core/error/layered-exception';

export class VoluntariadoServiceException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('VoluntariadoServiceException', methodName, cause);
  }
}
