import React from 'react'
import { useLocation, useParams } from 'react-router'
import Navbar from './Navbar'
import { productdata } from './data';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

function OrderDetails(props) {
    const location = useLocation();
    const propsData = location.state

    let { id } = useParams();
    console.log(id);
    const generatePDF = () => {
        var doc = new jsPDF('p', 'pt')
        doc.text(150, 140, `email : ${JSON.stringify(propsData.email)}`)//content
        doc.text(150, 170, `Account id : ${JSON.stringify(propsData.account_id)}`)
        doc.text(150, 200, `order id : ${JSON.stringify(propsData.order_id)}`)
        doc.text(150, 230, `Amount : ${JSON.stringify(propsData.amount / 100)}`)
        doc.text(150, 260, `Currency : ${JSON.stringify(propsData.currency)}`)



        // doc.text(40, 40, "asdffd")

        doc.save('Transaction_details.pdf')
    }
    return (
        <div className='m-0 p-0 bg-gray-100'>
            <Navbar />

            <div className='flex  justify-center item-center text-center border shadow-lg'>

                <div className="flex flex-col  p-6 space-y-4 sm:p-10 dark:bg-gray-900 dark:text-gray-100">
                    <h2 className="text-xl font-semibold">Your Order</h2>
                    <ul className="flex flex-col divide-y divide-gray-700">
                        {propsData.cart_products.map((product) => {
                            return <div className='p-5  flex flex-col'>
                                <div className='flex'>
                                    <div className='h-full'>
                                        <img src={productdata.find((p) => {
                                            return product.id === p.id;
                                        }).url} alt="cannot load" className='h-full w-[80px] float-left' />
                                    </div>
                                    <div className='flex-col flex text-left text-gray-700 text-lg font-semibold ml-5'>
                                        <div className='text-left'>
                                            {productdata.find((p) => {
                                                return product.id === p.id;
                                            }).product_name}
                                        </div>
                                        <div className='w-full '>Quantity : {product.quantity}</div>
                                        <div className='w-full '>Amount : {product.quantity * (productdata.find((p) => {
                                            return product.id === p.id;
                                        }).product_price)}</div>
                                    </div>
                                </div>
                                <div className="custom-number-input h-10 w-32">

                                </div>

                            </div>
                        })}
                    </ul>
                    <div className="space-y-1 text-right  text-3xl font-bold">
                        <p>Total amount:
                            <span>{propsData.amount / 100}</span>
                        </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <Link to="/Orders" className="px-6 py-2 border hover:border-black rounded-md dark:border-violet-400">
                            < span className="sr-only sm:not-sr-only">Go Back</span>
                        </Link>
                        <button onClick={generatePDF} className="px-6 py-2 border flex gap-5 hover:border-black rounded-md dark:border-violet-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>

                            < span className="sr-only  sm:not-sr-only">Download Transaction Details</span>
                        </button>
                        {/* <button type="button" className="px-6 py-2 border rounded-md dark:bg-violet-400 dark:text-gray-900 dark:border-violet-400">
                            <a onClick={displayRazorpay}>
                                <span className="sr-only sm:not-sr-only">Continue to Checkout</span>
                            </a>
                        </button> */}
                    </div>
                </div>
            </div >
        </div>
    )
}

export default OrderDetails
