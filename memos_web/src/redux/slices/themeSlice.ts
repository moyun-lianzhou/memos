import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { themeStorage } from '@/utils/storage';
interface ThemeState {
  theme: string | null;
}

const initialState: ThemeState = {
  theme: localStorage.getItem('theme'),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<{ theme:string }>) => {
      const { theme } = action.payload;
      console.log('redux 设置 theme：', theme)
      // 只存储用户信息，不存储token
      state.theme = theme;
      // 用户信息和 token 同步到 localStorage，防止刷新丢失
      themeStorage.setTheme(theme)
    },
    cancelTheme: (state) => {
      state.theme = null;
      themeStorage.clearTheme();
    },
  },
});

export const { setTheme, cancelTheme } = themeSlice.actions;
export default themeSlice.reducer;
