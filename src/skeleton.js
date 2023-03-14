import React from 'react'
import productdata from "./data.json"

function skeleton({ }) {
    async function RemoveItem(id) {
        const quantity = cartProducts.getProductQuantity(id);

        const addtoDB = await fetch('https://shopping-website-04lb.onrender.com/deleteFromCart', {
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
    return (
        <div>
            {productsincart !== 0 && productsincart.map((product) => {
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
        </div>
    )
}

export default skeleton