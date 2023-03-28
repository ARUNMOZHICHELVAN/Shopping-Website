import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import NavbarWelcome from './NavbarWelcome'
import { ToastContainer, toast } from 'react-toastify';
// import {usehi}
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [message, setmessage] = useState('')
    const Navigate = useNavigate()
    // const history = useHistory()

    async function validate(e) {
        e.preventDefault()
        const data = await fetch('https://shopping-website-04lb.onrender.com/login', {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                //stringify converts  objects to JSON OBJECT
                email: email,
                password: password
            })
        })
        const data2 = await data.json()
        console.log("response!!! ", data2)
        if (!data2.auth) {
            //If authorization fails coz of incorrect password/invalid email
            toast.error('Invalid Email or Password')
            console.log(data2.msg);
        }
        else {
            toast.success('Login Successfull')
            window.localStorage.setItem("token", data2.token)
            window.localStorage.setItem("user", email)

            Navigate('/Home');

        }
        // if (res.data.success) {
        //     console.log("Success")
        // }
        // else {
        //     console.log("Failure")
        // }
    }

    return (
        <div className="relative flex flex-col  bg-[#f9fafb] justify-center min-h-screen overflow-hidden">
            <NavbarWelcome />
            <ToastContainer />
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-indigo-500 underline">
                    Log in
                </h1>
                <form action='/login' method='POST' className="mt-6">
                    <div className="mb-2">
                        <label
                            for="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            onChange={(e) => setemail(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            for="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setpassword(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <Link to='/Password-change' className="text-xs text-indigo-500 hover:underline">
                        Forget Password?
                    </Link>
                    <div className="mt-6">
                        {message && <p className='text-red-300 font-bold'>{message}</p>}
                        <button type="submit"
                            onClick={(e) => validate(e)}
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors 
                         duration-200 transform bg-indigo-400 hover:bg-indigo-500
                         focus:outline-none ">
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    Don't have an account?{" "}
                    <Link to='/Register' className="font-medium text-indigo-500 hover:underline">
                        Sign up
                    </Link >
                </p>
            </div>


        </div>
    )
}

export default Login
