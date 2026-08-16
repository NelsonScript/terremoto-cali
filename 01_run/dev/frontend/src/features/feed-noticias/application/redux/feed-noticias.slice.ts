import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNoticiasRequest,
  fetchNoticiasSuccess,
  fetchNoticiasFailure,
} from '@features/feed-noticias/application/redux/feed-noticias.actions';
import { FeedNoticiasActionTypes } from '@features/feed-noticias/application/redux/feed-noticias.action-types';
import type { NoticiaClip } from '@features/feed-noticias/domain/entities/noticia-clip';

interface FeedNoticiasState {
  data: NoticiaClip[];
  status: FeedNoticiasActionTypes;
  error: Error | null;
  ultimaActualizacion: string | null;
}

const initialState: FeedNoticiasState = {
  data: [],
  status: FeedNoticiasActionTypes.FETCH_NOTICIAS_LOADING,
  error: null,
  ultimaActualizacion: null,
};

const feedNoticiasSlice = createSlice({
  name: 'feedNoticias',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoticiasRequest, (state) => {
        state.status = FeedNoticiasActionTypes.FETCH_NOTICIAS_LOADING;
        state.error = null;
      })
      .addCase(fetchNoticiasSuccess, (state, action) => {
        state.status = FeedNoticiasActionTypes.FETCH_NOTICIAS_SUCCESS;
        state.data = action.payload;
        state.ultimaActualizacion = new Date().toISOString();
      })
      .addCase(fetchNoticiasFailure, (state, action) => {
        state.status = FeedNoticiasActionTypes.FETCH_NOTICIAS_FAILURE;
        state.error = action.payload;
      });
  },
});

export default feedNoticiasSlice.reducer;
