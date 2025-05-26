import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userStorage } from '@/utils/storage';
interface UserState {
  userId: string | null;
  username: string | null;
}

const initialState: UserState = {
  userId: localStorage.getItem('userId'),
  username: localStorage.getItem('username'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; userId: string; username: string }>) => {
      const { token, userId, username } = action.payload;
      // 只存储用户信息，不存储token
      state.userId = userId;
      state.username = username;
      // 用户信息和 token 同步到 localStorage，防止刷新丢失
      userStorage.setUserInfo(token, userId, username)
    },
    logout: (state) => {
      state.userId = null;
      state.username = null;
      // 清除 localStorage
      userStorage.clearUserInfo()
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
