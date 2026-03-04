/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserPosts } from '../../api/posts';
import { Post } from '../../types/Post';

export interface PostsState {
  list: Post[];
  selected: Post | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PostsState = {
  list: [],
  selected: null,
  status: 'idle',
};

export const fetchPosts = createAsyncThunk<Post[], number>(
  'posts/fetchAll',
  async (userId: number) => {
    const users = await getUserPosts(userId);

    return users;
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost(state, action: PayloadAction<Post | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.status = 'idle';
        state.list = action.payload;
      })
      .addCase(fetchPosts.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const selectPosts = (state: { posts: PostsState }) => state.posts.list;

export const selectPostsStatus = (state: { posts: PostsState }) =>
  state.posts.status;

export const selectSelectedPost = (state: { posts: PostsState }) =>
  state.posts.selected;

export const { setSelectedPost } = postsSlice.actions;
export default postsSlice.reducer;
