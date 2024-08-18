import { Link } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import HomePageImage from "../assets/app-widget.jpg";

function HomePage() {
    return (
        <HomeLayout>
            <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]"> {/** here we are setting up the children of the HomeLayout Page */}
                <div className="w-1/2 space-y-6">
                    <h1 className="text-5xl font-semibold">
                    Find out best
                    <span className="text-indigo-600 font-bold"> Online Courses</span>
                    </h1>
                    <p className="text-xl text-gray-200">
                    Learn from the best online courses and get certified.
                    </p>

                    {/* <div className="flex gap-4"> */}
                        <div className="space-x-6">
                            <Link to={'/courses'} >
                                <button className="bg-indigo-600 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-indigo-700 transition-all ease-in-out">
                                    View Courses
                                </button>
                            </Link>

                            <Link to={'/contact'} >
                                <button className="border border-indigo-600 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-indigo-700 transition-all ease-in-out">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    {/* </div> */}
                </div>

                
                <div className="w-1/2wwww flex items-center justify-center">
                    <img alt="homepage image" src={HomePageImage}/>
                </div>
            </div>
        </HomeLayout>
    )
}

export default HomePage;