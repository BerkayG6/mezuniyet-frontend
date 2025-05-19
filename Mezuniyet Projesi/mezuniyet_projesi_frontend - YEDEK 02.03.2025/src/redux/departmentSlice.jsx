import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const getDepartment = createAsyncThunk("departments", async () => {
  const response = await axios.get("http://localhost:5000/departments");
  return response.data;
});

export const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDepartment.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getDepartment.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default departmentSlice.reducer;
