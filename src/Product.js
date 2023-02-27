
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useCartContext } from './CartContext';
// import { update } from 'tar';
import { productdata } from './data';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hover } from '@testing-library/user-event/dist/hover';
import { Cursor } from 'mongoose';


function Product(props) {
    const x = useCartContext();
    const [count, setcount] = useState(1);
    const [pincode, setpincode] = useState()
    const [productAvailable, setProductAvailable] = useState(0)


    function inc() {
        setcount(count + 1)
    }

    function dec() {
        if (count > 1) {
            setcount(count - 1)
        }

    }

    async function checkAvailability() {
        // let pincode = parseInt(document.querySelector('#pincode').value)
        console.log(pincode)
        if (isNaN(pincode)) {
            toast.error('Invalid Pincode', {
                position: 'top-left'
            })
            setProductAvailable(2)
            return
        }
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const data = await res.json()
        console.log("Triggered")
        if (data[0].Status === 'Success') {
            //if pincode exist check the product is availbale or not
            //using the same logic used in the Cart.js
            const citiesAvailable1 = productdata.find((product) => {
                return props.id === product.id
            }).city
            if (citiesAvailable1.includes((data[0].PostOffice[0]).District.toLocaleLowerCase())) {
                toast.success('The product is availbale in your location', {
                    position: 'top-left'
                })
                setProductAvailable(1)//1-->product can be added to cart
            }
            else {
                toast.error('The product is not available in you location try Changing Your location', {
                    position: 'top-left'
                })
                setProductAvailable(2)//cannot be added to the cart

            }
        }
        else {
            toast.error('Invalid Pincode', {
                position: 'top-left'
            })
            setProductAvailable(2) //cannot be added to the cart
        }
    }



    return (
        <div className="w-full bg-white  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

            <div className={`hidden bg-opacity-20 fixed  notAvailablemodal${props.id}  backdrop-blur-sm  inset-0  flex justify-center items-center`}>
                <div class="relative w-full h-full max-w-2xl  md:h-auto">
                    {/* <!-- notAvailablemodal content --> */}
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* <!-- notAvailablemodal header --> */}
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                Check whether the Product is available in Your location
                            </h3>
                            <button type="button" onClick={() => document.querySelector(`.notAvailablemodal${props.id}`).classList.add('hidden')} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-notAvailablemodal-hide="defaultnotAvailablemodal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close notAvailablemodal</span>
                            </button>
                        </div>


                        {/* <!-- notAvailablemodal body --> */}
                        <div class="p-6 space-y-6 ">
                            <div className="w-full bg-white  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                                <a className=''>
                                    <img
                                        className="p-8 rounded-t-lg w-[250px] h-[220px] mx-auto " src={props.url} alt="product image" />
                                </a>
                                <div class="flex px-5 mb-5">
                                    <div class="font-bold text-2xl mr-5">Enter pincode</div>
                                    <div>    <input type="text" id="pincode"
                                        onChange={(e) => setpincode(parseInt(e.target.value))}
                                        class="block mr-5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                    </div>
                                    <div onClick={() => checkAvailability()}>
                                        <button class="text-white   bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Check Availability
                                        </button>
                                    </div>
                                </div>

                                <div className="px-5 pb-5">
                                    <a >
                                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{props.product_name}</h5>
                                    </a>
                                    <div className="flex items-center mt-2.5 mb-5">
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                                    </div>

                                    <div className="flex  items-center justify-between">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ₹{props.product_price}</span>
                                        <button
                                            // to="/Cart"
                                            onClick={() => {
                                                if (productAvailable === 1) {
                                                    x.addOneToCart(props.id, count)
                                                    toast.success('Items added to Cart Successfully', {
                                                        position: 'top-left',
                                                    });
                                                }
                                            }

                                            }

                                            className={` text-white   bg-blue-700 ${productAvailable !== 1 ? "cursor-not-allowed" : ""} hover:${productAvailable !== 1 ? "bg-blue-800" : ""}
                                             focus:${productAvailable !== 1 ? "ring-4" : ""} focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>
                                            Add to cart
                                        </button>


                                        <div className="custom-number-input h-10 w-20 text-gray-600 hover:text-gray-700">
                                            <div className="flex flex-row h-8 border   rounded-lg  bg-transparent mt-1">
                                                <button data-action="decrement"
                                                    onClick={dec}
                                                    className=" bg-gray-300 mr-3  w-20 rounded-l cursor-pointer outline-none">
                                                    <span className="my-auto text-2xl font-thin">−</span>
                                                </button>
                                                <p >{count}</p>
                                                <button data-action="increment"
                                                    onClick={() => inc()}
                                                    className="bg-gray-300 ml-3  w-20 rounded-r cursor-pointer">
                                                    <span className="my-auto text-2xl font-thin">+</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer />
            <a className=''>
                <img onClick={() => document.querySelector(`.notAvailablemodal${props.id}`).classList.remove('hidden')}
                    className="p-8 rounded-t-lg w-[250px] h-[220px] mx-auto  " src={props.url} alt="product image" />
            </a>
            <div className="px-5 pb-5">
                <a>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{props.product_name}</h5>
                </a>
                <div className="flex items-center mt-2.5 mb-5">
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                </div>
                <div className="flex  items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{props.product_price}</span>
                    <button
                        // onClick={() => {
                        //     x.addOneToCart(props.id, count)
                        //     toast.success('Items added to Cart Successfully', {
                        //         position: 'top-left',
                        //     });
                        // }

                        // }
                        onClick={() => {
                            document.querySelector(`.notAvailablemodal${props.id}`).classList.remove('hidden')
                        }} className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                         dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart
                    </button>


                    <div className="custom-number-input h-10 w-20 text-gray-600 hover:text-gray-700">
                        <div className="flex flex-row h-8 border   rounded-lg  bg-transparent mt-1">
                            <button data-action="decrement"
                                onClick={dec}
                                className=" bg-gray-300 mr-3  w-20 rounded-l cursor-pointer outline-none">
                                <span className="my-auto text-2xl font-thin">−</span>
                            </button>
                            <p >{count}</p>
                            <button data-action="increment"
                                onClick={() => inc()}
                                className="bg-gray-300 ml-3  w-20 rounded-r cursor-pointer">
                                <span className="my-auto text-2xl font-thin">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Product