import { configureStore } from "@reduxjs/toolkit";
import historyReducer from "./slices/historySlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    history: historyReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
