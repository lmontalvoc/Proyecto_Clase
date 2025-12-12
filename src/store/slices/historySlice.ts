import { createSlice } from "@reduxjs/toolkit";

interface HistoryItem {
  id: string;
  imageUri: string;
  label: string;
  confidence?: number | null; // ← AHORA SÍ PERMITE null
  notes?: string;
  date: string;
}

interface HistoryState {
  items: HistoryItem[];
}

const initialState: HistoryState = {
  items: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addHistory: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
});

export const { addHistory } = historySlice.actions;

export default historySlice.reducer;
