import { configureStore } from '@reduxjs/toolkit';
import detectionsReducer from './detectionsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    detections: detectionsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
