import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    user: userReducer,  // 把 userSlice 加入 Store
    theme: themeReducer,  // 把 themeSlice 加入 Store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
