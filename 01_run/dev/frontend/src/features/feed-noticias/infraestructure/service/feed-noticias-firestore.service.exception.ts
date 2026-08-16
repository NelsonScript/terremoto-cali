import { LayeredException } from '@shared/core/error/layered-exception';

export class FeedNoticiasFirestoreServiceException extends LayeredException {
  constructor(methodName: string, cause: unknown) {
    super('FeedNoticiasFirestoreServiceException', methodName, cause);
  }
}
