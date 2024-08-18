import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slice/AuthSlice";
import courseSliceReducer from "./Slice/CourseSlice";
import razorpaySliceReducer from "./Slice/RazorpaySlice";
import lectureSliceReducer from "./Slice/LectureSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course: courseSliceReducer,
    razorpay: razorpaySliceReducer,
    lecture: lectureSliceReducer,
  },
  devTools: true,
});

export default store;
