import { configureStore } from "@reduxjs/toolkit";
import departmentSlice from "./departmentSlice";

const store = configureStore({
  reducer: {
    department: departmentSlice,
  },
});

export default store;
