import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Detection } from '../types/detection';

interface DetectionsState {
  items: Detection[];
}

const initialState: DetectionsState = {
  items: [],
};

const detectionsSlice = createSlice({
  name: 'detections',
  initialState,
  reducers: {
    addDetection(state, action: PayloadAction<Detection>) {
      // añadir al inicio (más reciente primero)
      state.items.unshift(action.payload);
    },
    setDetections(state, action: PayloadAction<Detection[]>) {
      state.items = action.payload;
    },
    clearDetections(state) {
      state.items = [];
    },
  },
});

export const { addDetection, setDetections, clearDetections } = detectionsSlice.actions;
export default detectionsSlice.reducer;
