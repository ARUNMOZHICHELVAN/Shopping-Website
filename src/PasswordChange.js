import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavbarWelcome from './NavbarWelcome'

function PasswordChange() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [cpassword, setcpassword] = useState('') //Confirm password
    const [message, setmessage] = useState('')

    const changePassword = (e) => {  
        e.preventDefault();

        fetch('https://shopping-website-04lb.onrender.com/Password-change', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                email: email,
                password: password,
                cpassword: cpassword
            })
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                const { status } = res
                console.log("Stau ", res)
                if (status === "Invalid Email") { setmessage(status) }
                if (res.status === "Passwords does not match") { setmessage(status) }
                if (res.status === "Password Changed Successfully") { setmessage(status) }
                console.log("Response from server on changing password", res)
            })
            .catch(err => {
                console.log("Error in changing password ", err)
            })


    }

    return (
        <div className="relative flex flex-col bg-[#f9fafb] justify-center min-h-screen overflow-hidden">
            <NavbarWelcome />
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-indigo-500 underline">
                    Change Password
                </h1>
                <form action='/Password-change' method='POST' className="mt-6">
                    <div className="mb-2">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            onChange={(e) => setemail(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
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
                    <div className="mb-2">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            onChange={(e) => setcpassword(e.target.value)}
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mt-6">
                        {message && <p className={`text-${message[message.length - 1] === 'y' ? 'green' : 'red'}-300 font-bold`}>{message}</p>}
                        <button type="submit"
                            onClick={(e) => changePassword(e)}
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors 
                         duration-200 transform bg-indigo-400 hover:bg-indigo-500
                         focus:outline-none ">
                            Change Password
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    <Link to='/Register' className="font-medium text-indigo-500 hover:underline">
                        Login
                    </Link >
                </p>
            </div>
        </div>
    )
}

export default PasswordChange