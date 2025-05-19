import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data24: [],
  isLoading24: false,
  error: null,
};

export const getConfirm = createAsyncThunk("confirms", async () => {
  try {
    console.log("Fetching confirm data from API...");
    const response = await axios.get("http://localhost:5000/confirm");
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching confirm data:", error);
    throw error;
  }
});

export const confirmSlice = createSlice({
  name: "confirm",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConfirm.pending, (state) => {
        state.isLoading24 = true;
        state.error = null;
        console.log("Confirm data loading started...");
      })
      .addCase(getConfirm.fulfilled, (state, action) => {
        state.data24 = action.payload;
        state.isLoading24 = false;
        console.log("Confirm data loaded successfully:", action.payload);
      })
      .addCase(getConfirm.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading24 = false;
        console.error("Error loading confirm data:", action.error);
      });
  },
});

export default confirmSlice.reducer;
