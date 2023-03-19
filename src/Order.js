import React, { Suspense, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
const Contact = React.lazy(() => import('./Contact'))

function Order() {
    //array of objects contains all the orders with the detailed information
    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        fetch('http://localhost:5000/Orders', {
            method: 'POST',
            
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                auth: window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                email: window.localStorage.getItem("user")
            })
        }).then((res) => {
            return res.json()
        })
            .then((data) => {
                console.log("data in Orders.js", data)
                setLoading(false)
                setdata(data)
            })
            .catch((err) => {
                console.log(err)
            })
        // const y = await x.json()
        // console.log("data got from the ORDERS ", x);

    }, [])
    // useEffect
    return (
        <div>
            <Navbar />
            <div className='p-28 flex-col gap-y-10 text-center '>
                {loading && <Skeleton count={8} />}
                {data.length === 0 && <h1 className='font-bold text-2xl'>There are no orders to display</h1>}

                {data.length !== 0 && data.map((orders) => {
                    return <Link to={`/Orders/:${orders.order_id}`} state={orders}>
                        <div className='w-full text-center mb-5 flex justify-center items-center h-24 font-bold text-2xl border hover:shadow-xl transition duration-300 ease-in-out'>
                            {orders.order_id}
                        </div>
                    </Link>
                })}
                {/* <div >
                    Order #123
                </div>
                <div className='w-full text-center flex justify-center items-center h-24 font-bold text-2xl border hover:shadow-xl transition duration-300 ease-in-out'>
                    Order #123
                </div> */}
            </div>
            <Suspense
                fallback={<div>Loading</div>}
            >
                <Contact />
            </Suspense>

        </div>
    )
}

export default Order
