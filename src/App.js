import React from 'react'
import { productdata } from './data'
import Navbar from './Navbar'
import Product from "./Product"
import { CartContext } from './CartContext'
function Main() {
  // console.log(User.find())
  return (

    <div className='m-0 p-0 bg-gray-100'>
      <Navbar />
      <div className='grid  grid-cols-1 lg:grid-cols-3 sm: gap-6 p-10
       '>
        {productdata.map((product) => {
          return (
            <Product
              id={product.id}
              product_name={product.product_name}
              product_price={product.product_price}
              quantity={product.quantity}
              url={product.url}
            />
          )
        })}
      </div>
    </div>

  )
}

export default Main