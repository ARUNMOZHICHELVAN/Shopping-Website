import React, { useEffect } from 'react'

function Contact() {
    useEffect(() => {
        // if (Math.random() > 0.5) {
        //     return new Error('aldsfj')
        // }
    }, [])

    return (
        <div className='w-full h-[30vh] bg-[#2a324d]'>
            <p className='text-[#f9fafc]'>Contact</p>
        </div>
    )
}

export default Contact