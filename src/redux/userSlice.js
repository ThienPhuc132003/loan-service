import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProfile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile(state, action) {
      state.userProfile = action.payload;
    },
  },
});

export const { setUserProfile } = userSlice.actions;
export default userSlice.reducer;