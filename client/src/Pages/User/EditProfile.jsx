import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateProfile } from "../../Redux/Slice/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";

const EditProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data, setData] = useState({
        previewImage: "",
        fullName: "",
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id),
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",()=>{
                setData({
                    ...data,
                    avatar: uploadedImage,
                    previewImage: fileReader.result,
                })
            })
        }
    }

    const handleUserInput = (e) =>{
        const {name,value} = e.target;
        console.log(`Input name: ${name}, value: ${value}`);
        setData({
            ...data,
            [name]: value,
        })
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();

        if(!data.fullName || !data.avatar){
            toast.error("All fields are required");
            return;
        }

        if(data.fullName.length < 5){
            toast.error("Name should be atleast 5 characters long");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", data.fullName); 
        formData.append("avatar", data.avatar);
        // console.log("formData",formData.entries().next().value);
        for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
        

        await dispatch(updateProfile([data.userId,formData]));     // since the thunk function is expecting an array of data as single parameter

        await dispatch(getUserData());

        navigate("/user/profile");

    }
    // console.log("data",data);
    

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-bold">
                        Edit Profile
                    </h1>

                    {/* input for image file */}
                    <label className="cursor-pointer" htmlFor="image_uploads">
                        {data.previewImage ? (
                        <img
                            className="w-28 h-28 rounded-full m-auto"
                            src={data.previewImage}
                            alt="preview image"
                        />
                        ) : (
                        <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
                        )}
                    </label>
                    <input
                        onChange={handleImageUpload}
                        className="hidden"
                        type="file"
                        id="image_uploads"
                        name="image_uploads"
                        accept=".jpg, .jpeg, .png"
                    />
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-lg font-semibold" htmlFor="fullName">
                        Full Name
                        </label>
                        <input
                        required
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Enter your full name"
                        className="bg-transparent px-2 py-1 border"
                        value={data.fullName}
                        onChange={handleUserInput}
                        />
                    </div>

                    <Link to={"/user/profile"}>
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                        <AiOutlineArrowLeft /> Back to Profile
                        </p>
                    </Link>

                    <button
                        className="w-full bg-indigo-700 hover:bg-indigo-600 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
                        type="submit"
                    >
                        Update Profile
                    </button>

                </form>
            </div>
        </HomeLayout>
    )
}

export default EditProfile;