import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const getDepartment = createAsyncThunk("departments", async ({ filters, isUniversityProfile }) => {
  // isUniversityProfile true ise /university-departments, değilse /departments endpoint'ini kullan
  let url = isUniversityProfile 
    ? "http://localhost:5000/university-departments"
    : "http://localhost:5000/departments";

  // Eğer university-departments endpoint'ini kullanıyorsak, token'ı da gönder
  const headers = isUniversityProfile 
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {};

  const queryParams = [];

  if (filters) {
    if (filters.universityName) {
      queryParams.push(`universityName=${encodeURIComponent(filters.universityName)}`);
    }
    if (filters.departmentName) {
      queryParams.push(`departmentName=${encodeURIComponent(filters.departmentName)}`);
    }
    if (filters.year) {
      queryParams.push(`year=${encodeURIComponent(filters.year)}`);
    }
    if (filters.lastRank) {
      queryParams.push(`lastRank=${encodeURIComponent(filters.lastRank)}`);
    }
    if (filters.lastScore) {
      queryParams.push(`lastScore=${encodeURIComponent(filters.lastScore)}`);
    }
  }

  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }

  const response = await axios.get(url, { headers });
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
