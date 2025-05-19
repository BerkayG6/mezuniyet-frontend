import { configureStore } from "@reduxjs/toolkit";
import departmentSlice from "./departmentSlice";
import universitySlice from "./universitySlice";

const store = configureStore({
  reducer: {
    department: departmentSlice,
    university: universitySlice,
  },
});

export default store;
