import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    courseData: [],
}

export const getAllCourses = createAsyncThunk("course/get", async () => {
    try {
        const response = axiosInstance.get("/courses");

        toast.promise(response, {
            loading: "Loading the courses....",
            success: "Courses loaded successfully",
            error: "Failed to load courses",
        })
        return (await response).data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const createNewCourse = createAsyncThunk("course/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);

        const response = axiosInstance.post("/courses", formData);
        toast.promise(response, {
            loading: "Creating the course....",
            success: "Course created successfully",
            error: "Failed to create course",
        })

        return (await response).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message);
        
    }
})

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers:(builder) =>{
        builder.addCase(getAllCourses.fulfilled, (state,action) => {
            console.log(action.payload);
            state.courseData = [...action.payload]; // the payload contains what we return from the createAsyncThunk

        })

    }
});

export default courseSlice.reducer;