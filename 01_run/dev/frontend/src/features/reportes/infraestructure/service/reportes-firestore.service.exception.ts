import { LayeredException } from '@shared/core/error/layered-exception';

export class ReportesServiceException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('ReportesServiceException', methodName, cause);
  }
}
