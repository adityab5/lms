import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomeLayout from "../../Layouts/HomeLayout";

const CourseDiscription = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const {state} = location;

    const { role, data } = useSelector((state) => state.auth);


    useEffect(() => {
        console.log(location)
    }, [])

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white">
                {/**displaying the course details */}
                <div className="grid grid-cols-2 gap-10 py-10 relative">
                    {/* creating the left side of description box */}
                    <div className="space-y-5">
                        <img
                            className="w-full h-64"
                            src={state?.thumbnail?.secure_url}
                            alt="thumbnail"
                        />

                        <div className="space-y-4">

                            <div className="flex flex-col items-center justify-between text-xl">
                                <p className="font-semibold">
                                <span className="text-indigo-600 font-bold">
                                    Total Lectures :{" "}
                                </span>
                                {state.numberOfLectures}
                                </p>
                                <p className="font-semibold">
                                <span className="text-indigo-600 font-bold">
                                    Instructor :{" "}
                                </span>
                                {state.createdBy}
                                </p>
                            </div>

                            {/* adding the subscribe button */}
                            {role === "ADMIN" || data?.subscription?.status === "active" ? (
                                <button
                                onClick={() =>
                                    navigate("/course/displaylectures", {
                                    state: { ...state },
                                    })
                                }
                                className="bg-indigo-700 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-indigo-600 transition-all ease-in-out duration-300"
                                >
                                Watch Lectures
                                </button>
                            ) : (
                                <button
                                onClick={() => navigate("/checkout")}
                                className="bg-indigo-700 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-indigo-600 transition-all ease-in-out duration-300"
                                >
                                Subscribe to Course
                                </button>
                            )}
                        </div>  
                    </div>
                    
                    {/* creating the right section of description box */}
                    <div className="space-y-2 text-xl">
                        <h1 className="text-3xl font-bold text-indigo-600 text-center mb-4">
                        {state.title}
                        </h1>

                        <p className="text-indigo-600 font-bold">Course Description :</p>

                        <p>{state.description}</p>
                    </div>

                </div> 
            </div>
        </HomeLayout>
    )
}

export default CourseDiscription;