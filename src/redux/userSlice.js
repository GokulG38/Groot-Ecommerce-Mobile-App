import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload;
    },
    clearUser: (state) => {
      state.id = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUserId = (state) => state.user.user;

export default userSlice.reducer;
