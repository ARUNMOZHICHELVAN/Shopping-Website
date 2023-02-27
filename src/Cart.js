import React, { Suspense, useEffect, useState } from 'react'
import { Link, redirect } from 'react-router-dom'
// import { resolve } from 'styled-jsx/css'
import { useCartContext } from './CartContext'
import CartProductCards from './CartProductCards'
import { getProductData, productdata } from './data'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Product from './Product'
import io from "socket.io-client"
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './Errorboundary'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
// import Contact from './Contact'
const Contact = React.lazy(() => import('./Contact'))



const socket = io('http://localhost:5000')
socket.on('connect', () => {
    console.log("cart connection" + socket.id)

})
export default function Cart() {
    const [productsincart, setproducts] = useState([])
    const [x, setx] = useState(0)
    const cartProducts = useCartContext()
    useEffect(() => {
        const d = async () => await fetch('http://localhost:5000/getCartDB', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                auth: window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                email: window.localStorage.getItem("user"),
            })
        }).then(data => data.json())
            .then(data1 => {
                console.log(data1)
                setproducts(data1)
            })
        d()

    }, [x])

    async function RemoveItem(id) {
        const quantity = cartProducts.getProductQuantity(id);

        const addtoDB = await fetch('http://localhost:5000/deleteFromCart', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                //stringify converts Javascript objects to JSON OBJECT
                email: window.localStorage.getItem("user"),
                token: window.localStorage.getItem("token"),
                item_id: id,
                item_count: quantity
            })
        })
        //We get the setproducts (a state setter) coz whenever we remove an item from the cart 
        //we should update the state so that the page re-renders and produces the updated result fromm the db
        setx(!x)
        console.log("added to db ", JSON.stringify(addtoDB))
        // setCartProducts(cartProduct.filter((product) => {
        //     //true means include
        //     return product.id !== id;
        // }))
    }

    console.log("productsincart", productsincart)

    //The below one is to display the cart items from the database

    let navigate = useNavigate()
    useEffect(() => {

        socket.on('payment-details', (payment_details) => {
            // const data = await payment_details.json()
            const data = JSON.parse(payment_details)
            // console.log('data sending from Cart.js to Success.js (IN OBJECT FORMAT) ', data);
            // console.log("._doc --> ", data._doc)
            if ((data.captured)) {
                // alert(JSON.stringify(cartProducts.items))
                console.log("Final CART PRODUCTS", cartProducts.items)
                navigate('/Cart/Success', {
                    state: { ...(data._doc), cart_products: cartProducts.items }
                })
            }
            else {
                navigate('/Cart/Failure')
            }
        })


    })




    // console.log(cartProducts.items)
    function loadRazorpay() {
        return new Promise((response, resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            document.body.appendChild(script)
            script.onload = () => {
                console.log("arun")
                resolve(true)//whenever script loads successfully return true
            }
            script.onerror = () => {
                resolve(false)
            }

        })
    }


    async function displayRazorpay() {



        console.log("cartproduct.items " + JSON.stringify(cartProducts.items));

        try {
            const res = await loadRazorpay();
            console.log("response12 " + res)
            if (res) {
                alert('Razorpay failed to load are u online??');
                return
            }
            console.log("display Razor pay working fine!!");
        }
        catch (err) {
            console.log(err)
        }

        const data = await fetch('http://localhost:5000/razorpay', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                //stringify converts Javascript objects to JSON OBJECT
                amount_to_be_paid: cartProducts.getTotalCost(productsincart),
                cart_products: productsincart
            })
        })

        const data2 = await data.json();
        console.log("HOW MUCH TO PAY GOT FROM THE SERVER")
        // window.location.assign('/PaymentStatus')

        // console.log("HERE is the data" + data);



        // catch (err) {
        //     console.log("Error in fetching data from backend" + err)
        // }


        var options = {
            "key": "rzp_test_LbxCLSZLFeb3gR",
            // "amount": cartProducts.getTotalCost().toString(),
            "currency": data2.currency.toString(),
            "order_id": data2.id,
            "name": "Shopping Website",
            "description": "Test Transaction",
            "handler": function (response) {
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
            },
            "prefill": {
                "email": window.localStorage.getItem("user"),
                "contact": "9999999999",
            },

        };
        console.log(options)

        console.log("PORTAL OPENED");
        var rzp1 = new window.Razorpay(options)
        rzp1.open();


        console.log("END OF  THE CODE!");
    }

    return (

        <div className='m-0 p-0 bg-gray-100'>
            <ToastContainer />

            <Navbar />


            {/* <ToastContainer> */}

            <div className='flex  justify-center item-center text-center border shadow-lg'>

                <div className="flex flex-col  p-6 space-y-4 sm:p-10 dark:bg-gray-900 dark:text-gray-100">
                    <h2 className="text-xl font-semibold">Your cart</h2>
                    <ul className="flex flex-col divide-y divide-gray-700">
                        {!productsincart.length ? <></> : productsincart.map((product) => {
                            return <div className='p-5  flex flex-col'>
                                <div className='flex'>
                                    <div className='h-full'>
                                        <img src={productdata.find((p) => {
                                            return product.id === p.id;
                                        }).url} alt="unable to load" className='h-full w-[80px] float-left' />
                                    </div>
                                    <div className='flex-col flex text-left text-gray-700 text-lg font-semibold ml-5'>
                                        <div className='text-left'>
                                            {productdata.find((p) => {
                                                return product.id === p.id;
                                            }).product_name}
                                        </div>
                                        <div className='w-full '>Quantity : {product.count}</div>
                                        <div className='w-full '>Amount : {product.count * (productdata.find((p) => {
                                            return product.id === p.id;
                                        }).product_price)}</div>
                                    </div>
                                    <div className='ml-auto' onClick={() => {
                                        RemoveItem(product.id)
                                    }} >
                                        <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 ' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </div>
                                </div>
                                {/* <div className="custom-number-input h-10 w-32">
                                    {/* <div className='flex border border-black'>
                                    <div className="flex flex-row h-8 w-full rounded-lg relative bg-transparent mt-1">
                                        <button data-action="decrement"
                                            onClick={() => cartProducts.removeOneFromCart(product.id)}
                                            className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                                            <span className="m-auto text-2xl font-thin">−</span>
                                        </button>
                                        <p>{cartProducts.getProductQuantity(product.id).quantity}</p>
                                        <p>arunmozhichl</p>
                                        <button data-action="increment"
                                            onClick={() => cartProducts.OneToCart(product.id, cartProducts.getProductQuantity(product.id))}
                                            className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                                            <span className="m-auto text-2xl font-thin">+</span>
                                        </button>
                                    </div>
                                </div> */}

                                {/* </div> */}

                            </div>
                        })}
                    </ul>
                    <div className="space-y-1 text-right  text-3xl font-bold">
                        <p>Total amount:
                            <span>{cartProducts.getTotalCost(productsincart)}</span>
                        </p>
                        <p className="text-sm dark:text-gray-400">Not including taxes and shipping costs</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Link to="/Home" className="px-6 py-2 border hover:border-black rounded-md dark:border-violet-400">
                            < span className="sr-only sm:not-sr-only">Back to shop</span>
                        </Link>
                        <a href='/' type="button" >
                        </a>
                        <button type="button" className="px-6 py-2 border  hover:border-black rounded-md dark:bg-violet-400 dark:text-gray-900 dark:border-violet-400">
                            <a onClick={displayRazorpay}>
                                <span className="sr-only sm:not-sr-only">Continue to Checkout</span>
                            </a>
                        </button>
                    </div>
                </div>
            </div >
            {/* <div className='w-full h-full'> */}
            {/* <ErrorBoundary */}
            {/* FallbackComponent={ErrorFallback}
                onReset={() => {
                    // reset the state of your app so the error doesn't happen again
                }} */}
            {/* <Suspense fallback={<div>LOADING</div>} > */}
            <Suspense
                fallback={<div>Loading</div>}
            >
                <Contact />
            </Suspense>
            {/* </Suspense>
                </ErrorBoundary> */}

            {/* </div> */}
        </div >

    )
}