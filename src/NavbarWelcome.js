import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function NavbarWelcome() {

    return (
        <div className='  top-0 w-full mt-0 '>
            {/* <!-- component --> */}
            <nav className="bg-white shadow">
                <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
                    <div className="flex justify-between items-center">
                        <div className='flex'>
                            <a className="text-gray-800 text-xl ml-4 font-bold md:text-2xl hover:text-gray-700" >AMC</a>
                        </div>

                        {/* <!-- Mobile menu button --> */}
                        <div className="flex md:hidden">
                            <button type="button" className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600" aria-label="toggle menu">
                                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                    <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
                    <div className=" md:flex items-center">
                        <div className="flex-col  hidden lg:block">
                            <Link to="/" className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0" >
                                Home
                            </Link>
                            <Link to="/login" className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0" >
                                Login
                            </Link>
                            <Link to="/Register" className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0">Signup
                            </Link>
                        </div>

                        {/* <div className="flex justify-center md:block">
                            <a className="relative text-gray-700 hover:text-gray-600" href="#">
                                <Link to="/Cart" >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </Link>
                                {/* <a onClick={logout} className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0" >
                                    Logout
                                </a> */}

                        {/* <span className="absolute top-0 left-0 rounded-full bg-indigo-500 text-white p-1 text-xs"></span>
                            </a>
                        </div> */}
                    </div>
                </div>
            </nav>


        </div>
    )
}

export default NavbarWelcome