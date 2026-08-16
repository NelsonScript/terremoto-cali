import type { RootState } from '@config/state-managment/store';
import { FeedNoticiasActionTypes } from '@features/feed-noticias/application/redux/feed-noticias.action-types';

export const selectFeedNoticias = (state: RootState) => state.feedNoticias;
export const selectFeedNoticiasIsLoading = (state: RootState) =>
  state.feedNoticias.status === FeedNoticiasActionTypes.FETCH_NOTICIAS_LOADING;
