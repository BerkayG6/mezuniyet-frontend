import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const getPredictedDepartment = createAsyncThunk(
  "predicted_departments",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/predicted_departments"
    );
    return response.data;
  }
);

export const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPredictedDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPredictedDepartment.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getPredictedDepartment.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export default departmentSlice.reducer;
