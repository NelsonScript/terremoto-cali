import { LayeredException } from '@shared/core/error/layered-exception';

export class ReportesUseCasesException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('ReportesUseCasesException', methodName, cause);
  }
}
