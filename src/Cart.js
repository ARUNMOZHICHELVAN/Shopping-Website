import React, { Suspense, useEffect, useState } from 'react'
import { Link, redirect } from 'react-router-dom'
// import { resolve } from 'styled-jsx/css'
import { useCartContext } from './CartContext'
import CartProductCards from './CartProductCards'
import productdata from './data.json'
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

const Contact = React.lazy(() => import('./Contact'))



const socket = io('http://localhost:5000')
socket.on('connect', () => {
    console.log("cart connection" + socket.id)

})
export default function Cart() {
    const [productsInCart, setProducts] = useState([])
    const [x, setX] = useState(0)
    const cartProducts = useCartContext()
    const [loading, setLoading] = useState(true)
    //notAvailable --> contains products in cart that are out of stock which will be useful
    //when user tries to purchase those items in the cart section
    const [notAvailable, setNotAvailable] = useState([])


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
                setLoading(false)
                setProducts(data1)
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
        let newNotAvailable = notAvailable.filter((p) => p.id !== id)
        setNotAvailable(newNotAvailable)
        //If there are no products which are out of stock in the cart then close the modal and display
        //  a success toaster message
        if (notAvailable.length === 0 && (!document.querySelector('.notAvailablemodal').classList.contains('hidden'))) {
            toast.success('🤗 You removed all the items which are out of stock from Your cart')
        }
        if (notAvailable.length === 0) {
            document.querySelector('.notAvailablemodal').classList.add('hidden')
            document.querySelector('.outer-div').classList.add('relative')
        }

        //We get the setProducts (a state setter) coz whenever we remove an item from the cart 
        //we should update the state so that the page re-renders and produces the updated result fromm the db
        setX(!x)
        console.log("added to db ", JSON.stringify(addtoDB))
        // setCartProducts(cartProduct.filter((product) => {
        //     //true means include
        //     return product.id !== id;
        // }))
    }

    console.log("productsInCart", productsInCart)

    //The below one is to display the cart items from the database

    let navigate = useNavigate()
    useEffect(() => {

        socket.on('payment-details', (payment_details) => {
            // const data = await payment_details.json()
            const data = JSON.parse(payment_details)
            // console.log('data sending from Cart.js to Success.js (IN OBJECT FORMAT) ', data);
            // console.log("._doc --> ", data._doc)
            if ((data.captured)) {
                //Before redidirecting to success page update the count of the products in cart
                //Total → 7 apples if i add 5 apples to cart and make payment now in my store  
                // Total —> 7-5 =2 apples are left but still my cart will contain 5 apples so add if else check while displaying the products in the cart
                let dup = [...productsInCart]
                for (let i = 0; i < dup.length; i++) {
                    let x = dup[i].count
                    let y = productdata.find((p) => p.id === dup[i].id).quantity
                    if (x > y) {
                        dup[i].count = y;
                    }
                }
                console.log("dup11 ", dup)
                setProducts(dup)
                console.log("Final CART PRODUCTS", productsInCart)
                navigate('/Cart/Success', {
                    state: { ...(data._doc), cart_products: productsInCart }
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
                amount_to_be_paid: cartProducts.getTotalCost(productsInCart),
                cart_products: productsInCart
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
    function checkAndContinue() {
        if (productsInCart.length === 0) {
            toast.info('Your cart is empty Add some items to Purchase')
        }
        let x = []
        for (let i = 0; i < productsInCart.length; i++) {
            if (productdata.find((p) => p.id === productsInCart[i].id).quantity === 0) {
                x.push({ id: productsInCart[i].id })
            }
        }
        if (x.length > 0) {
            setNotAvailable(x)
            document.querySelector('.notAvailablemodal').classList.remove('hidden')
            document.querySelector('.outer-div').classList.remove('relative')

        }
        else {
            displayRazorpay()


        }
    }

    return (

        <div className='m-0 p-0 bg-gray-100 relative'>
            {/* Some of the  products may be out of stock so tell the user to remove those items */}
            <div className='hidden  z-100 bg-opacity-20 fixed  notAvailablemodal  backdrop-blur-sm  inset-0  flex justify-center items-center'>
                <div class="relative w-full h-full max-w-2xl  md:h-auto">
                    {/* <!-- notAvailablemodal content --> */}
                    <div class=" bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* <!-- notAvailablemodal header --> */}
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Some of the products in the Cart Out of Stock Plzz remove them to proceed
                            </h3>
                            <button type="button" onClick={() => document.querySelector('.notAvailablemodal').classList.add('hidden')} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-notAvailablemodal-hide="defaultnotAvailablemodal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close notAvailablemodal</span>
                            </button>
                        </div>


                        {/* <!-- notAvailablemodal body --> */}
                        <div class="p-6 space-y-6 overflow-y-scroll max-h-80">
                            {/* <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                            </p>
                            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                            </p> */}
                            <div>
                                {!notAvailable.length === 0 ? <Skeleton count={10} /> : notAvailable.map((product) => {
                                    return <div className='p-5  flex flex-col text-base leading-relaxed'>
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
                                                {/* <div className='w-full flex-col'>Cities we deliver : {(product.citiesAvailable1.join(', '))}</div> */}
                                            </div>
                                            <div className='ml-auto' onClick={() => {
                                                RemoveItem(product.id)
                                            }} >
                                                <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 ' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>


                        </div>


                    </div>
                </div>
            </div>
            <ToastContainer />

            <Navbar />


            {/* <ToastContainer> */}

            <div className='flex  justify-center item-center text-center border shadow-lg'>

                <div className="flex flex-col  p-6 space-y-4 sm:p-10 dark:bg-gray-900 dark:text-gray-100">
                    <h2 className="text-xl font-semibold">Your cart</h2>
                    <ul className="flex flex-col divide-y divide-gray-700">
                        {loading && <Skeleton count={8} />}
                        {!productsInCart.length ? <></> : productsInCart.map((product) => {
                            return <div className='p-5 outer-div flex flex-col relative'>
                                <div className='flex'>
                                    <div className='h-full'>
                                        <img src={productdata.find((p) => {
                                            return product.id === p.id;
                                        }).url} alt="unable to load" className='h-full w-[80px] float-left' />
                                    </div>
                                    {/* OUT OF STOCK */}

                                    {productdata.find((p) => p.id === product.id).quantity === 0 && <div className='absolute top-0 left-0 bg-gray-500 bg-opacity-50 text-white px-2 py-1 z-10'>Out of Stock</div>
                                    }
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

                            </div>
                        })}
                    </ul>
                    <div className="space-y-1 text-right  text-3xl font-bold">
                        <p>Total amount:
                            <span className='Total-amount'>{cartProducts.getTotalCost(productsInCart)}</span>
                        </p>
                        <p className="text-sm dark:text-gray-400">Not including taxes and shipping costs</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Link to="/Home" className="px-6 py-2 border hover:border-black rounded-md dark:border-violet-400">
                            < span className="sr-only sm:not-sr-only">Back to shop</span>
                        </Link>
                        <button type="button"
                            onClick={checkAndContinue}
                            className={`px-6 py-2 border  hover:border-black rounded-md dark:bg-violet-400 dark:text-gray-900 dark:border-violet-400`}>
                            <a >
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