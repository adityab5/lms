import { BsPersonCircle } from "react-icons/bs";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import HomeLayout from "../Layouts/HomeLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createAccount } from "../Redux/Slice/AuthSlice";

const Signup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [previewImage, setPreviewImage] = useState("");
    

    const [showPassword, setShowPassword] = useState(false);

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: "",
    });

    //me only
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    const handleUserInput = (e) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value,
        });
    }

    // handling image upload
    const getImage = (event) => {
        // const file = event.target.files[0];
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onloadend = () => {
        //     setPreviewImage(reader.result);
        //     setSignupData({
        //         ...signupData,
        //         avatar: reader.result,
        //     });

        event.preventDefault();
        //getting the image
        const uploadedImage = event.target.files[0];

        if(uploadedImage) {
            setSignupData({
                ...signupData,
                avatar: uploadedImage,
            })

            //creating a new file reader
            const fileReader = new FileReader();
            //reading the image as data url
            fileReader.readAsDataURL(uploadedImage);
            // when the file reader has loaded the image then set the preview image to the result of the file reader object which is the base64 encoded image of the uploaded image 
            fileReader.addEventListener("load", function() {
                console.log(this.result);   // this.result is the base64 encoded image // this is referring to the fileReader object
                setPreviewImage(this.result);
            });
        }
    }

    async function createNewAccount(event){
        event.preventDefault();

        // checking the empty fields
        if(!signupData.fullName || !signupData.email || !signupData.password || !signupData.avatar){
            toast.error("Please fill all the fields");
            return;
        } 
        // checking the name field length
        if (signupData.fullName.length < 5) {
            toast.error("Name should be atleast of 5 characters");
            return;
        }

        // email validation using regex
        if (!signupData.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            toast.error("Invalid email id");
            return;
        }

        // password validation using regex
        if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
            toast.error("Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol");
            return;
        }

        // creating the form data from the existing data
        const formData = new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);

        // dispatch create account action
        const response = await dispatch(createAccount(formData));
        
        if(response?.payload?.success)
            navigate("/");

        // clearing the signup inputs
        setSignupData({
            fullName: "",
            email: "",
            password: "",
            avatar: "",
        });
        setPreviewImage("");

    }


    return (
        <HomeLayout>
            <div className="flex overflow-x-auto items-center justify-center h-[90vh]">
                <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 p-4 w-96 text-white rounded-lg shadow-[0_0_10px_black]">
                    <h1 className="text-center font-bold text-2xl">Sign Up for <span className="text-indigo-600 font-bold text-3xl">Free</span> !</h1>

                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {previewImage ? (
                            <img className="w-24 h-24 rounded-full m-auto" src={previewImage} alt="Preview"/>
                        ) : (
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>
                        )}
                    </label>

                    <input 
                        onChange={getImage}
                        type="file" 
                        className="hidden" 
                        name="image_uploads" 
                        id="image_uploads" 
                        accept=".jpg , .png , .jpeg,.svg"
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="fullName" className="font-semibold">Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" 
                            required 
                            placeholder="Enter your name" 
                            className="bg-transparent px-2 py-1 rounded-lg border"
                            onChange={handleUserInput}
                            value={signupData.fullName}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required 
                            placeholder="Enter your email" 
                            className="bg-transparent px-2 py-1 rounded-lg border"
                            onChange={handleUserInput}
                            value={signupData.email}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} // Show password if showPassword is true
                                id="password" 
                                name="password" 
                                required 
                                placeholder="Enter your password" 
                                className="bg-transparent px-2 py-1 rounded-lg border w-full"
                                onChange={handleUserInput}
                                value={signupData.password}
                            />
                            <span 
                                onClick={togglePasswordVisibility} 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                        <button  className="mt-2 bg-indigo-600 hover:bg-indigo-500 transition-all ease-in-out duration-300 rounded-md p-2 font-semibold text-lg cursor-pointer"> 
                            Create Account
                        </button>
                    </div>

                    <p className="text-center">
                        Already have an account? <Link to="/login" className="link text-accent font-semibold cursor-pointer">Login</Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    );
};

export default Signup;
