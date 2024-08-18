import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slice/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import { useEffect } from "react";
import CourseCard from "../../Components/CourseCard";

function CourseList() {

    const dispatch = useDispatch();

    const {courseData} = useSelector((state) => state.course);

    async function loadAllCourses() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadAllCourses();
    }, []);


    //now UI
    return (
        <HomeLayout>
            <div className="min-h-[90vh] pl-20 pt-12 flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl mb-5 font-semibold underline">
                    Explore the courses made my{" "} 
                    <span className="font-bold text-indigo-600">
                         Industry Experts 
                    </span>
                </h1>

                {/**here we render all our course cards */}
                <div className="mb-10 flex flex-wrap gap-14">
                    {courseData?.map((element) => {
                        return <CourseCard key={element._id} data={element} />
                    })}
                </div>

            </div>
        </HomeLayout>
    )
}

export default CourseList;