import { configureStore } from '@reduxjs/toolkit';
import { compareReducer } from './slice/compareSlice';
import { fileReducer } from './slice/fileSlice';

export const store = configureStore({
  reducer: {
    file: fileReducer,
    compare: compareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
