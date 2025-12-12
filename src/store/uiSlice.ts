import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
  error?: string;
}

const initialState: UIState = {
  loading: false,
  error: undefined,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = undefined;
    },
  },
});

export const { setLoading, setError, clearError } = uiSlice.actions;
export default uiSlice.reducer;
