import { configureStore } from "@reduxjs/toolkit";
import departmentSlice from "./departmentSlice";
import universitySlice from "./universitySlice";
import predictSlice from "./predictSlice";
import confirmSlice from "./confirmSlice";

const store = configureStore({
  reducer: {
    department: departmentSlice,
    university: universitySlice,
    predict: predictSlice,
    confirm: confirmSlice,
  },
});

export default store;
