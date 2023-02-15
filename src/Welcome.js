import React from 'react'
import Navbar from './Navbar'
import NavbarWelcome from './NavbarWelcome'



function Welcome() {
    return (
        <div className='bg-gray-200 flex-col'>
            <NavbarWelcome />

            <div className='bg-gradient-to-r  from-sky-400 to-cyan-300 min-h-screen flex justify-center items-center'>
                <div className='flex items-center h-full justify-center mb-28'>
                    <h1 className='font-bold text-4xl font-press-start text-center '>Shopping made Easy</h1>
                </div>
            </div>
        </div>

    )
}

export default Welcome
