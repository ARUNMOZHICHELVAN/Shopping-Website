import React, { Suspense, useState } from 'react'
import productdata from './data.json'
import Navbar from './Navbar'
import Product from "./Product"
import { CartContext } from './CartContext'
import Skeleton from 'react-loading-skeleton'

const Contact = React.lazy(() => import('./Contact'))
function Main() {
  const [userLocation, setUserLocation] = useState('')


  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("latitude  " + latitude)
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
      const data = await res.json()
      setUserLocation(data.localityInfo.administrative[2].name.toLocaleLowerCase())
    },
    (error) => {
      // error callback
      console.error(error);
      setUserLocation('denied')
      document.querySelector('.location-access-modal').classList.remove('hidden')
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    }
  );

  //This state has the whole json data of all products for updating the values of quantity key in the data
  const [productDetail, setProductDetail] = useState(productdata)
  return (

    <div className='m-0 p-0 bg-gray-100'>
      <Navbar />
      {/* <div className={`hidden bg-opacity-20 fixed  location-access  backdrop-blur-sm  inset-0  flex justify-center items-center`}> */}
      <div className={`hidden bg-opacity-20 fixed  location-access-modal  backdrop-blur-sm  inset-0  flex justify-center items-center`}>
        <div class="relative w-full h-full max-w-2xl  md:h-auto">
          {/* <!-- notAvailablemodal content --> */}
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- notAvailablemodal header --> */}
            <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Check whether the Product is available in Your location
              </h3>
              <button type="button" onClick={() => document.querySelector(`.location-access-modal`).classList.add('hidden')} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-notAvailablemodal-hide="defaultnotAvailablemodal">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Close notAvailablemodal</span>
              </button>
            </div>


            {/* <!-- notAvailablemodal body --> */}
            <div class="p-6 space-y-6 ">
              plzz Give the location access to get more personalized feed
            </div>

          </div>
        </div>
      </div>
      {/* </div> */}
      <div className='grid  grid-cols-1 lg:grid-cols-3 sm: gap-6 p-10
       '>
        {productdata.map((product) => {
          if (userLocation) {
            return (
              <Product
                id={product.id}
                product_name={product.product_name}
                product_price={product.product_price}
                quantity={product.quantity}
                url={product.url}
                userLocation={userLocation}
              />
            )
          }
          else {
            return <Skeleton count={5} />
          }

        })}
      </div>
      <Suspense
        fallback={<Skeleton count={5} />}
      >
        <Contact />
      </Suspense>
    </div>

  )
}

export default Main