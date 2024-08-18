import Course from "../models/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const getAllCourses = async (req, res,next) => {
    try{
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: "All courses",     
            courses,
        });
    }catch(err){
        return next(new AppError(err.message, 500));
    }
};

const getCourseByCourseId = async (req, res,next) => {

    try {
        // const {id} = req.params;
        // console.log(id);
        const course = await Course.findById(req.params.id);
        // console.log(course);
        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course lectures fethced successfully",
            lectures: course.lectures,
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }

}

const createCourse = async (req, res,next) => {
    try {
        const { title, description, category, createdBy } = req.body;

        if(!title || !description || !category || !createdBy){
            return next(new AppError("Please fill all the fields", 400));
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: 'Dummy',
                secure_url: 'Dummy',
            }
        });

        if (!course) {
            return next(new AppError("Course could not be created", 404));
        }

        if(req.file){
            try{
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
            })
            console.log(result);
            if(result){
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`)
        }catch(err){
            return next(new AppError(err.message, 500));
        }
        }

        await course.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

const updateCourse = async (req, res,next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body, //compliant

            },
            {
                runValidators: true, //verify mongo model validators
            }
        );

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
        });

    } catch (err) {
        return next(new AppError(err.message, 500));
    }

}

const removeCourse = async (req, res,next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

const addLectureToCourseById = async (req, res,next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        const { title, description } = req.body;

        if (!course) {
            return next(new AppError("Course not found", 404));
        }

        if(!req.body.title || !req.body.description){
            return next(new AppError("Please provide title and description", 400));
        }

        // course.lectures.push(req.body);
        const lectureData = {
            title,
            description,
        };

        if(req.file){
            try{
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
            })
            console.log(result);
            if(result){
                lectureData.lecture = {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                }
            }

            fs.rm(`uploads/${req.file.filename}`)
        }catch(err){
            return next(new AppError(err.message, 500));
        }
        }

        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Lecture added successfully",
        });

    } catch (err) {
        return next(new AppError(err.message, 500));
    }
};  

export { getAllCourses, getCourseByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById };