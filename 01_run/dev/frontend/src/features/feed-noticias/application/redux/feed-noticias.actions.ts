import { createAction } from '@reduxjs/toolkit';
import { FeedNoticiasActionTypes } from '@features/feed-noticias/application/redux/feed-noticias.action-types';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';

export const fetchNoticiasRequest = createAction(FeedNoticiasActionTypes.FETCH_NOTICIAS_LOADING);
export const fetchNoticiasSuccess = createAction<NoticiaClip[]>(FeedNoticiasActionTypes.FETCH_NOTICIAS_SUCCESS);
export const fetchNoticiasFailure = createAction<Error>(FeedNoticiasActionTypes.FETCH_NOTICIAS_FAILURE);
