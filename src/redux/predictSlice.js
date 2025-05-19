import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPredictedDepartment = createAsyncThunk(
    "predict/getPredictedDepartment",
    async () => {
        const response = await axios.get("http://localhost:5000/predict");
        return response.data;
    }
);

const predictSlice = createSlice({
    name: "predict",
    initialState: {
        data: [],
        studentData: {
            selectedUniversity: null,
            selectedDepartment: null,
            studentRank: null,
            studentScore: null,
            predictedData: {
                predicted_first_rank: null,
                predicted_last_rank: null
            }
        },
        isLoading: false,
        error: null,
    },
    reducers: {
        setStudentData: (state, action) => {
            console.log("Setting student data:", action.payload); // Debug için
            state.studentData = {
                ...state.studentData,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPredictedDepartment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPredictedDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                console.log("Predicted data loaded:", action.payload); // Debug için
            })
            .addCase(getPredictedDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                console.error("Error loading predicted data:", action.error); // Debug için
            });
    },
});

export const { setStudentData } = predictSlice.actions;
export default predictSlice.reducer; 