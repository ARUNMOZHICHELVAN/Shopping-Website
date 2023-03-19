
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useCartContext } from './CartContext';
// import productData from './data.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hover } from '@testing-library/user-event/dist/hover';
import { Cursor } from 'mongoose';
import { useEffect } from 'react';
import ReactHover from 'react-hover/dist/ReactHover';
import { Hover } from 'react-hover';
import Trigger from 'react-hover/dist/lib/Trigger';


function Product(props) {
    const x = useCartContext();
    const [count, setCount] = useState(1)
    const [pincode, setPincode] = useState(0)
    //productAvailable --> for allowing the user to add items to cart only if the product is availbale in his/her location
    const [productAvailable, setProductAvailable] = useState(0)
    //state which manages the props quantity that is being recieved
    //Let us say there are 10 items in stock if the user puts all the 10 items in the cart then 
    //for that particular  user the home page should display that the product is out of stock
    const [quantity, setQuantity] = useState(props.quantity)
    // console.log("location--> " + props.userLocation)
    const [availableStatus, notAavailableStatus] = useState(false)
    const [availableInLocation, setAvailalbeInLocation] = useState(false)
 
    useEffect(() => {
        
        if (quantity === 0 || props.userLocation === 'denied') {
            return;
        }
        const x = props.city
        console.log("location--> " + props.userLocation)
        for (let index = 0; index < x.length; index++) {
            console.log(x[index])
            if (props.userLocation.includes(x[index])) {
                setAvailalbeInLocation(false)
                //if the user's location is already enabled and if the product is available in user's location 
                //then we can directly allow the user to add items to cart without even  checking availability option button
                setProductAvailable(true)
                return;
            }

        }
        setAvailalbeInLocation(true)
    }, [])
   
    useEffect(() => {
        const fetchcartQuantityDB= async() => {
            const data = await fetch('http://localhost:5000/getCart', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                auth: window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                email: window.localStorage.getItem("user"),
            })
        })
        const res = await data.json() 

        const find = res.Cart.find((p) => p.id === props.id)
        if (find !== undefined && props.quantity != 0) {
            //If the product exist in the cart then only set the state
            console.log("PRODUCT ANN --> ",props.quantity-find.count)
            setQuantity(props.quantity - find.count)
        }
        }
        fetchcartQuantityDB()
        
    },[])   
    






    useEffect(() => {
        console.log("After updating we get ", quantity)
        if (count > quantity && quantity >= 0) {
            console.log("quantity is set")
            setCount(quantity)
        }

    }, [quantity])



    function inc() {
        console.log("incrment triggered -->!")
        if (count + 1 <= quantity && count + 1 >= 0) {
            console.log("quantity --> ", quantity)
            setCount(count + 1)
        }
    }

    function dec() {
        if (count > 1) {
            setCount(count - 1)
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
            const citiesAvailable1 = props.city
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
        <div className="w-full bg-white  border border-gray-200 p-4 rounded-lg  shadow ">

            <div className={`hidden bg-opacity-20 fixed  notAvailablemodal${props.id}  backdrop-blur-sm  inset-0  flex justify-center items-center`}>
                <div class="relative w-full h-full max-w-2xl  md:h-auto">
                    {/* <!-- notAvailablemodal content --> */}
                    <div class="relative bg-white rounded-lg shadow dark:bg-[#c5d6e7]">
                        {/* <!-- notAvailablemodal header --> */}
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-400">
                            <h3 class="text-2xl font-semibold text-gray-900 ">
                                Check whether the Product is available in Your location
                            </h3>
                            <button type="button" onClick={() => document.querySelector(`.notAvailablemodal${props.id}`).classList.add('hidden')} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-notAvailablemodal-hide="defaultnotAvailablemodal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close notAvailablemodal</span>
                            </button>
                        </div>


                        {/* <!-- notAvailablemodal body --> */}

                        <div class="p-6 space-y-6 ">
                            <div className="w-full bg-white  border border-gray-200  rounded-lg shadow ">

                                <a className=''>
                                    <img
                                        className="p-8 rounded-t-lg w-[250px] h-[220px] mx-auto " src={props.url} alt="product image" />
                                </a>
                                
                                {/* <div class={`${quantity !== 0 ? "hidden" : ""} text- ml-5 p-2    text-red-500 text-2xl currently-unavailable${props.id}`}>Currently Unavailable</div> */}
                                <div class={`flex px-5 mb-5 ${quantity === 0 ? "hidden" : ""} `}>
                                    <div class="font-bold text-2xl mr-5">Enter pincode</div>
                                    <div>    <input type="text" id="pincode"
                                        onChange={(e) => setPincode(parseInt(e.target.value))}
                                        class="block mr-5 h-8 mt-1 text-gray-900 border  rounded-lg border-blue-200 sm:text-md focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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
                                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">{props.product_name}</h5>
                                    </a>
                                    <div className="flex items-center mt-2.5 mb-5">
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                                    </div>

                                    <div className={`flex  items-center justify-between ${quantity===0 ? "hidden" : ""}`}>
                                        <span className="text-3xl font-bold text-gray-900 ">
                                            ₹{props.product_price}</span>
                                        <button
                                            // to="/Cart"
                                            onClick={async () => {
                                                if (productAvailable === 1 && count <= quantity && count != 0) {
                                                    await x.addOneToCart(props.id, count)
                                                    console.log("quantity ", quantity)
                                                    console.log("count ", count)
                                                    setQuantity(quantity - count)
                                                    toast.success('Items added to Cart Successfully', {
                                                        position: 'top-left',
                                                    });
                                                }
                                                else if(productAvailable!==1){
                                                    toast.info('Check whether the product is deliverable to Your locaiton or not')
                                                }
                                            }

                                            }

                                            className={` text-white   bg-blue-700 ${quantity === 0 ? "cursor-not-allowed" : ""} ${productAvailable !== 1 ? "cursor-not-allowed" : ""} hover:${productAvailable !== 1 ? "bg-blue-800" : ""}
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
            <div className=''>
            <a className=''>
                <img onClick={() => document.querySelector(`.notAvailablemodal${props.id}`).classList.remove('hidden')}
                    className="p-8 rounded-t-lg w-[250px] h-[220px] mx-auto  " src={props.url} alt="product image" />
            </a>
            {/* <p className='absolute inset-0 bg-gray-500 bg-opacity-50 text-white h-8 w-24'>Out of Stock</p> */}

            </div>

            
                <div className=''>
                <a>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">{props.product_name}</h5>
                </a>

                {/* sold out  */}
                {/* <img src='https://cdn.iconscout.com/icon/premium/png-512-thumb/sold-out-876564.png?f=avif&w=256'
                                className={`${quantity!==0? "hidden" : ""} h-8 w-8 currently-unavailable${props.id}`} /> */}
                <div class={`${quantity !== 0 ? "hidden" : ""} text-bold  text-red-500 text-2xl currently-unavailable${props.id}`}>Currently Unavailable</div>
                {availableInLocation &&  
                <ReactHover >
                <Trigger type="trigger" className="visible">
  <img src='https://img.icons8.com/dusk/256/checked-truck.png'  className=" h-8 w-8 hover:opacity-100" />
</Trigger>

                <Hover type="hover">
                  <div className='border  bg-gray-100 flex'>
                    <div className='pr-2'>
                    <h1 className='font-bold text-xl text-green-500'>Can be Delivered to Your Location</h1>
                    </div>
                    <div>
                    <img src='https://img.icons8.com/color/256/checked.png' alt='Unable to Load' className='h-8 w-8'/>
                        
                    </div>
                    </div>
                </Hover>
              </ReactHover>
                }
                {/* <img src='https://img.icons8.com/dusk/256/checked-truck.png'  className='h-8 w-8'/> */}
                <div className="flex items-center mt-2.5 mb-5">
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                </div>
                <div className={`flex  items-center justify-between ${quantity===0 ? "hidden" : ""}`}>
                    <span className="text-3xl font-bold text-gray-900 ">
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