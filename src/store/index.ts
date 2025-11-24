import { configureStore } from "@reduxjs/toolkit";
import * as historyReducerMod from "./slices/historySlice";
import * as uiReducerMod from "./slices/uiSlice";

// Ensure compatibility with different module interop styles (default vs named)
const historyReducer = (historyReducerMod as any)?.default ?? (historyReducerMod as any);
const uiReducer = (uiReducerMod as any)?.default ?? (uiReducerMod as any);

if (typeof historyReducer !== "function" || typeof uiReducer !== "function") {
  // Helpful debug info if reducers are not functions at runtime
  // eslint-disable-next-line no-console
  console.error("Store reducers are invalid:", {
    historyReducerType: typeof historyReducer,
    uiReducerType: typeof uiReducer,
    historyReducerMod,
    uiReducerMod,
  });
}

export const store = configureStore({
  reducer: {
    history: historyReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
