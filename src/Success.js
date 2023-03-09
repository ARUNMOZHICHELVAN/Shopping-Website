import React, { useState } from 'react'
import Navbar from './Navbar'
import io from "socket.io-client"
import { useCartContext } from './CartContext'
import { useEffect } from 'react'
import { Route, useLocation } from 'react-router'

const socket = io('http://localhost:5000')

socket.on('connect', () => {
    console.log("Success page connection to socket " + socket.id)
})

export default function Success() {
    const cartProducts = useCartContext()
    // const payment_details = route.

    const [data, setData] = useState({});

    const location = useLocation();

    useEffect(() => {
        //location.state is itself is a object
        console.log(location.state)
        console.log("order id in success page ", location.state.order_id)
        console.log("cart products in sucess page", location.state.cart_products)


        fetch('http://localhost:5000/addCartProduct', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                email: window.localStorage.getItem("user"),
                order_id: location.state.order_id,
                cart_products: location.state.cart_products
            })
        }).then(res => console.log("result of fetch from succes.js --> server  ", res))
            .catch(err => console.log(err))



        // payment.updateOne({ order_id: location.state.payment_details.order_id }, { $set: { cart_products: location.state.cart_products } })
        // db.users.updateOne({order_id:'"order_LCRU2Z6r9og36V"'},{$set : {cart_products : [{name:"arun"},{name:"uio"}]}})

        setData(location.state)

    }, [])

    return (
        <div>
            <Navbar />
            <div style={{ whiteSpace: "pre-wrap" }}>
                {/* {data._doc.} */}
                {/* <h1>Email : </h1><p>{JSON.stringify(data._doc.email.slice(3, data._doc.email.length - 1))}</p> */}
                {/* {data && JSON.stringify(data._doc, null, 3)} */}
            </div>

            <div className='text-center'><h1 className='font-bold text-2xl mt-[80px]'>Your Order has been placed successfully</h1></div>
            <div className='text-center'><h1 className='font-bold text-2xl mt-[80px]'>Go to Your Orders Section to access your Order</h1></div>
            {/* {JSON.stringify(cartProducts.items)} */}
        </div>
    )
}
