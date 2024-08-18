
import { model,Schema } from "mongoose";

const courseSchema = new Schema({
    title:{
        type:String,
        required:[true,"Please enter course title"],
        trim:true,
        minLength:[3,"Course title can not be less than 3 characters"],
        maxLength:[100,"Course title can not exceed 100 characters"]
    },
    description:{
        type:String,
        required:[true,"Please enter course description"],
        minLength:[3,"Course description can not be less than 3 characters"],
        maxLength:[2000,"Course description can not exceed 2000 characters"],
        trim:true,
    },
    category:{
        type:String,
        required:[true,"Please select course category"],

    },
    thumbnail:{
        public_id:{
            type:String,
            required:true,
        },
        secure_url:{
            type:String,
            required:true,
        }
    },
    lectures:[{
        title: String,
        description: String,
        lecture:{
            public_id:{
                type:String,
                requireed:true,
            },
            secure_url:{
                type:String,
                required:true,
            }
            
        }
    }],
    numberOfLectures:{
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        required:true,
        // ref:"User",
    },
},{
    timestamps:true,
});

const Course = model("Course",courseSchema);
 
export default Course;