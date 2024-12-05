// File: uiSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isSidebarVisible: true,
};
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarVisible = !state.isSidebarVisible;
    },
    setSidebarVisibility(state, action) {
      state.isSidebarVisible = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarVisibility } = uiSlice.actions;
export default uiSlice.reducer;
