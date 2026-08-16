import { LayeredException } from '@shared/core/error/layered-exception';

export class FeedNoticiasUseCasesException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('FeedNoticiasUseCasesException', methodName, cause);
  }
}
