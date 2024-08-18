import { useNavigate } from "react-router-dom";

function CourseCard({data}) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate('/course/description/',{state:{...data}})} // here we need to add id also
            //In the destination component, you can access the state using the useLocation hook:
            //const { state } = useLocation();
            className="text-white w-[22rem] h-[430px] shadow-lg rounded-lg cursor-pointer group overflow-hidden bg-zinc-700">
            <div className="overflow-hidden">
                <img 
                    className="h-28 w-full rounded-tl-lg rounded-tr-full group-hover:scale=[1,2] transition-all ease-in-out duration-300"
                    src={data?.thumbnail?.secure_url} alt="course thumbnail"
                />

                <div className="p-3 space-y-1 text-white">
                    <h2 className="text-lg font-bold text-indigo-600 line-clamp-2">
                        {data?.title}
                    </h2>

                    <p className="text-sm line-clamp-3">
                        {data?.description}
                    </p>

                    <p className="font-semibold">
                        <span className="text-indigo-600 font-bold">Category:</span>
                        {data?.category}
                    </p>

                    <p className="font-semibold">
                        <span className="text-indigo-600 font-bold">Total Lectures :</span>
                        {data?.numberOfLectures}
                    </p>

                    <p className="font-semibold">
                        <span className="text-indigo-600 font-bold">Instructor :</span>
                        {data?.createdBy}
                    </p>

                </div>

            </div>

        </div>
    )
}

export default CourseCard;