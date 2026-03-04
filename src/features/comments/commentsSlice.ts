/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getPostComments,
  createComment,
  deleteComment,
} from '../../api/comments';
import { Comment } from '../../types/Comment';

export interface CommentsState {
  list: Comment[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CommentsState = {
  list: [],
  status: 'idle',
};

// load comments for a post
export const fetchComments = createAsyncThunk<Comment[], number>(
  'comments/fetchAll',
  async (postId: number) => {
    const comments = await getPostComments(postId);

    return comments;
  },
);

// add a new comment and return it
export const addComment = createAsyncThunk<Comment, Omit<Comment, 'id'>>(
  'comments/add',
  async commentData => {
    const comment = await createComment(commentData);

    return comment;
  },
);

// remove a comment by id, return the id so reducer can drop it
export const removeComment = createAsyncThunk<number, number>(
  'comments/remove',
  async commentId => {
    await deleteComment(commentId);

    return commentId;
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.status = 'idle';
          state.list = action.payload;
        },
      )
      .addCase(fetchComments.rejected, state => {
        state.status = 'failed';
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.list.push(action.payload);
        },
      )
      .addCase(
        removeComment.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.list = state.list.filter(c => c.id !== action.payload);
        },
      );
  },
});

export const selectComments = (state: { comments: CommentsState }) =>
  state.comments.list;
export const selectCommentsStatus = (state: { comments: CommentsState }) =>
  state.comments.status;

export default commentsSlice.reducer;
