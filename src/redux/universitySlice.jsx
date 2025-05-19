import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  university: [],
  isLoading: false,
  error: null,
};

export const getUniversity = createAsyncThunk("universities", async () => {
  const response = await axios.get("http://localhost:5000/universities");
  return response.data;
});

export const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUniversity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUniversity.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getUniversity.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default universitySlice.reducer;
