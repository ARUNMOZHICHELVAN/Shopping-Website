import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import NavbarWelcome from './NavbarWelcome'

function Register() {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    //For displaying messages such as user registered || user already registered
    const [registered, setregistered] = useState(0)

    async function validate(event) {
        event.preventDefault()
        const data = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                //stringify converts Javascript objects to JSON OBJECT
                name: name,
                email: email,
                password: password
            })
        })
        const data2 = await data.json()
        console.log("Response from server ", data2)
        if (data2 !== "Email already exist") {
            //1 --> display User registered Successfully message
            //2-->display User already Exist message
            setregistered(1)
        }
        else {
            setregistered(2)
        }
    }

    return (
        <div>
            <NavbarWelcome />
            <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
                <div>
                </div>
                <div>
                    <a >
                        <h3 className="text-4xl font-bold text-indigo-500">
                            Sign up
                        </h3>
                    </a>
                </div>
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
                    <form action='/register' method='POST'>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Name
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="text"
                                    name="name"
                                    onChange={(e) => setname(e.target.value)}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Email
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="email"
                                    name="email"
                                    onChange={(e) => setemail(e.target.value)}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    onChange={(e) => setpassword(e.target.value)}
                                    name="password"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {registered === 1 && <p className='text-green-300 font-bold'>Registered Successfully</p>}
                            {registered === 2 && <p className='text-green-300 font-bold'>Already Registered Kindly Login</p>}
                            <Link to='/Login' className="text-sm ml-4 text-gray-600 underline hover:text-gray-900">
                                Login
                            </Link>
                            <button
                                type="submit"
                                onClick={(e) => validate(e)}
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white bg-indigo-400 hover:bg-indigo-500 uppercase transition duration-150 ease-in-out  border border-transparent rounded-md  false"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
