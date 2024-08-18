import { FiMenu } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { logout } from '../Redux/Slice/AuthSlice';

function HomeLayout({ children }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // for checking if user is logged in
    
    const isLoggedIn = useSelector(state => state?.auth?.isLoggedIn);
    console.log("log",isLoggedIn);
    

    // for displaying options according to the role
    const role = useSelector(state => state?.auth?.role);

    function changeWidth() {
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 'auto';
    }

    function hideDrawer() {
        const element = document.getElementsByClassName('drawer-toggle');
        element[0].checked = false;

        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width = 0;
    }

    async function handleLogout(e) {
        e.preventDefault();

        // remove the user from the local storage
        const res = await dispatch(logout());

        if(res?.payload?.success) {
            navigate('/');
        }
    }

    return (
        <div className="min-h-[90vh]">
            <div className="drawer absolute left-0 w-fit z-50">
                <input type="checkbox" id="my-drawer" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="cursor-pointer relative">
                        <FiMenu onClick={changeWidth} size={"32px"} className='text-white font-bold m-4' />
                    </label>
                </div>
                <div className="drawer-side w-0">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-48 sm:w-80 bg-base-200 relative text-base-content">
                        <li className="w-fit right-2 z-50 absolute">
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24} />
                            </button>
                        </li>

                        <li>
                            <Link to={'/'}>
                                Home
                            </Link>
                        </li>

                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link to={'/admin/dashboard'}>
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}

                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link to={'/course/create'}>
                                    Create a new course
                                </Link>
                            </li>
                        )}

                        <li>
                            <Link to={'/courses'}>
                                All Courses
                            </Link>
                        </li>

                        <li>
                            <Link to={'/contact'}>
                                Contact Us
                            </Link>
                        </li>

                        <li>
                            <Link to={'/about'}>
                                About Us
                            </Link>
                        </li>

                        {!isLoggedIn && (
                            <li className="relative bottom-0 w-[90%]">
                                <div className="w-full flex items-center justify-center">
                                    <button className='btn-primary px-4 py-1 font-semibold rounded-md w-full'>
                                        <Link to={'/login'}>
                                            Login
                                        </Link>
                                    </button>
                                    <button className='btn-secondary px-4 py-1 font-semibold rounded-md w-full'>
                                        <Link to={'/signup'}>
                                            Signup
                                        </Link>
                                    </button>
                                </div>
                            </li>
                        )}

                        {isLoggedIn && (
                            <li className="relative bottom-0 w-[90%]">
                                <div className="w-full flex items-center justify-center gap-4">
                                    <button className='btn btn-primary px-4 py-1 font-semibold rounded-md w-fit'>
                                        <Link to={'/user/profile'}>
                                            Profile
                                        </Link>
                                    </button>
                                    <button className='btn btn-secondary px-4 py-1 font-semibold rounded-md w-fit'>
                                        <Link onClick={handleLogout}>
                                            Logout
                                        </Link>
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {children}

            <Footer />
        </div>
    );
}

export default HomeLayout;
