import { createSlice } from "@reduxjs/toolkit";

interface HistoryItem {
  id: string;
  imageUri: string;
  label: string;
  confidence: number;
  notes: string;
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

// Debug: log created slice shape to ensure actions/reducer are available at runtime
// eslint-disable-next-line no-console
console.log("historySlice debug:", {
  actions: Object.keys(historySlice.actions || {}),
  reducerType: typeof historySlice.reducer,
});

export const { addHistory } = historySlice.actions;

export default historySlice.reducer;
