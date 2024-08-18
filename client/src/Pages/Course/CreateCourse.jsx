import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { createNewCourse } from "../../Redux/Slice/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { AiOutlineArrowLeft } from "react-icons/ai";
import toast from "react-hot-toast";

function CreateCourse () {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userInput,setUserInput ] = useState({
        title: "",
        description: "",
        category: "",
        createdBy: "",
        thumbnail: null,
        previewImage: "",
    });

    const handleImageUpload = (e) => {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage){
            const fileReader = new FileReader();//Lets web applications asynchronously read the contents of files (or raw data buffers) stored on the user's computer, using File or Blob objects to specify the file or data to read
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load",()=>{
                setUserInput({
                    ...userInput,
                    thumbnail: uploadedImage,
                    previewImage: fileReader.result, // this.result (if normal function is used)
                })
            })
        }
    }

    const handleUserInput = (e) => {
        const {name,value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value,
        })
    }

    const onFormSubmit = async (e) => {
        e.preventDefault();
         
        if(!userInput.title || !userInput.description || !userInput.category || !userInput.createdBy || !userInput.thumbnail){
            toast.error("All fields are required");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));

        if(response?.payload?.success){
            setUserInput({
                title: "",
                description: "",
                category: "",
                createdBy: "",
                thumbnail: null,
                previewImage: "",
            })
        }

        navigate("/courses");

    }


    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] h-[450px] my-10 shadow-[0_0_10px_black] relative"
                >

                    <Link 
                        to="/admin/dashboard"
                        className="absolute top-8 text-2xl link text-accent cursor-pointer">
                    <AiOutlineArrowLeft/>
                    </Link>

                    <h1 className="text-center text-2xl font-bold">
                        Create a New Course
                    </h1>

                    <main className="grid grid-cols-2 gap-x-10">
                        <div className="gap-y-6">
                            <div>
                                <label htmlFor="image_uploads" className="cursor-pointer">
                                    {userInput.previewImage ? (
                                        <img
                                        className="w-full h-44 m-auto border" 
                                        src={userInput.previewImage}
                                        alt="preview image"
                                        />
                                    ) : (
                                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                                        <h1 className="font-bold text-lg">
                                            Upload your Course Thumbnail
                                        </h1>
                                        </div>
                                    )}
                                    
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    name="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            {/* adding the title section */}
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="title">
                                Course Title
                                </label>

                                <input
                                required
                                type="name"
                                name="title"
                                id="title"
                                placeholder="Enter the course title"
                                className="bg-transparent px-2 py-1 border"
                                value={userInput.title}
                                onChange={handleUserInput}
                                />
                                
                            </div>

                        </div>

                        
                        {/* for course description and go to profile button */}
                            {/**Right Side */}
                        {/* adding the course description */}
                        <div className="flex flex-col gap-1">
                            {/* adding the instructor */}
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="createdBy">
                                Instructor Name
                                </label>
                                <input
                                required
                                type="name"
                                name="createdBy"
                                id="createdBy"
                                placeholder="Enter the instructure name"
                                className="bg-transparent px-2 py-1 border"
                                value={userInput.createdBy}
                                onChange={handleUserInput}
                                />
                            </div>

                            {/* adding the category */}
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="category">
                                Course Category
                                </label>
                                <input
                                required
                                type="name"
                                name="category"
                                id="category"
                                placeholder="Enter the category name"
                                className="bg-transparent px-2 py-1 border"
                                value={userInput.category}
                                onChange={handleUserInput}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="description">
                                Course Description
                                </label>
                                <textarea
                                required
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Enter the course description"
                                className="bg-transparent px-2 py-1 border h-24 overflow-y-scroll resize-none"
                                value={userInput.description}
                                onChange={handleUserInput}
                                />
                            </div>
                        </div>
                        
                    </main>

                    <button type="submit" className="w-full py-2 rounded-sm font-semibold text-lg cursor-pointer bg-indigo-700 hover:bg-indigo-600 transition-all ease-in-out">
                        Create Course
                    </button>

                </form>
            </div>
        </HomeLayout>
    )
}

export default CreateCourse 