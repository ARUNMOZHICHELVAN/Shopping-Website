import React ,{useEffect,useState} from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import { toast } from 'react-toastify';
import { ConnectionStates } from 'mongoose';
import Skeleton from 'react-loading-skeleton';

export default function SelectAddress() {
    const [addresses,setAddresses]=useState([])
    // const [shippingAddress,setShippingAddress]=useState([])
    const [added,setAdded]=useState(0)
    const [selectedAddress,setSelectedAddress]=useState([])
    const [productsInOrders, setProducts] = useState([])
    const [notAvailable,setNotAvailable]=useState([])
    // const []
    //getting the addresss of the user
  useEffect(() => {
    const d = async () => await fetch('http://localhost:5000/getAddress', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                auth: window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                email: window.localStorage.getItem("user")
            })
        }).then(data => data.json())
            .then(data1 => {
                console.log("addresss of user --> ",data1.Address)
                setAddresses(data1.Address)
            })
        d()
  },[added])

  useEffect(() => {
    const d = async () => await fetch('http://localhost:5000/getOrders', {
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
                console.log("data 1 --> ",data1)
                setProducts(data1)
            })
        d()
  },[])

  function validate(e){
    e.preventDefault()
    const form=document.getElementById("addressForm")
    console.log("form --> ",form.elements.street.value)
    const d = async () => await fetch('http://localhost:5000/addAddress', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                auth: window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                email:window.localStorage.getItem("user"),
                street: form.elements.street.value,
                area: form.elements.area.value,
                city:form.elements.city.value,
                phone_no:form.elements.phone_no.value
            })
        }).then(data => data.json())    
            .then(data1 => {
                console.log("data 1 --> ",data1)
                setAdded(!added)
            })
        d()
  }

  function RemoveItem(id){
    const d = async () => await fetch('http://localhost:5000/deleteNotAvailable', {
            method: 'POST',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                auth: window.localStorage.getItem("token")
            },
            body: JSON.stringify({
                cart_products:notAvailable
            })
        }).then(data => data.json())    
            .then(data1 => {
                console.log("data 1 --> ",data1)
                setAdded(!added)
            })
        d()
  }

   function RemoveAlloutofStock(params) {
       
   }

  function checkAndContinue(){
    const d = async () => await fetch('http://localhost:5000/getOrders', {
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
                console.log("data 1 --> ",data1)
                setProducts(data1)  
            })
        d()
    let notAvailablearray=[]
    
    productsInOrders.forEach(element => {
        const x=productData.find((p) => p.id === element.id)
        console.log("selected Address ",selectedAddress.city)
        let ref=0
        for (let index = 0; index <x.city.length; index++) {
            console.log(selectedAddress.city.toLowerCase())
            if(selectedAddress.city.toLowerCase().includes(x.city[index])){
                ref=1
                break
            }
        }
        if(ref==0){
            notAvailablearray.push(x)
        }
    });
    if(notAvailablearray.length>0){
        // toast.info('Some of the products in the cart is not deliverable to the selected address')
        setNotAvailable(notAvailablearray)
        document.querySelector('.notAvailablemodal').classList.remove('hidden')
    }
  }


  const [productData,setproductData]=useState([])
  useEffect(() => {
    const d=async () => {
        const data = await (await fetch('http://localhost:5000/getProductData')).json()
        console.log("product data --> ",data)
        setproductData(data)
    }
    d()
  },[])

    function setForm(event) {
        event.target.checked=true
        console.log(event.target.id)
        if(event.target.id===""){
            console.log("undefined")
        }
        else{
            if(event.target.id!==selectedAddress.id)
            setSelectedAddress(event.target)
        }
    }
    useEffect(() => {
        console.log("Selected address ",selectedAddress)
    },[selectedAddress])
    

  return (
    <div>
        <Navbar />

        {/* notAvailableModel */}
        {notAvailable.length>0 &&  <div className='hidden bg-opacity-20 fixed  notAvailablemodal  backdrop-blur-sm  inset-0  flex justify-center items-center'>
                <div class="relative w-full h-full max-w-2xl  md:h-auto">
                    {/* <!-- notAvailablemodal content --> */}
                    <div class=" bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* <!-- notAvailablemodal header --> */}
                        <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-violet-400">
                                Some of the products in the Cart are not deliverable to your Selected address({selectedAddress.city}). Plzz remove them to proceed
                            </h3>
                            <button type="button" onClick={() =>{
                                document.querySelector('.notAvailablemodal').classList.add('hidden')
                                productsInOrders.forEach((product) => {
                                    if(product.count === 0){
                                        document.querySelector(`.outOfStock${product.id}`).classList.remove('hidden')
                                        document.querySelector(`.imageInCart${product.id}`).classList.add('relative')
                                        document.querySelector(`.outer-div${product.id}`).classList.add('relative')
                                        document.querySelector(`.outer-div${product.id}`).classList.remove('hidden')
                                    }
                                })
                                
                                // document.querySelector('.outOfStock').classList.remove('hidden')
                            }}  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-notAvailablemodal-hide="defaultnotAvailablemodal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close notAvailablemodal</span>
                            </button>
                        </div>

                        {/* <!-- notAvailablemodal body --> */}
                        <div class="p-6 space-y-6 overflow-y-scroll max-h-80">
                        {/* <img src='https://static.libertyprim.com/files/familles/pomme-large.jpg?1569271834' alt='unable to load' /> */}

                            {/* <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
                            </p>
                            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
                            </p> */}
                            <div>
                                {!(notAvailable.length>0 && productData.length>0) ? <Skeleton count={10} /> : notAvailable.map((product) => {
                                    return <div className='p-5  flex flex-col text-base leading-relaxed'>
                                        <div className='flex'>
                                            <div className='h-full'>
                                                <img src={productData.find((p) => {
                                                    return product.id === p.id;
                                                }).url} alt="unable to load" className='h-full w-[80px] float-left' />
                                            </div>
                                            <div className='flex-col flex text-left text-gray-700 text-2xl text-white font-bold ml-5'>
                                                <div className='text-left'>
                                                    {productData.find((p) => {
                                                        return product.id === p.id;
                                                    }).product_name}
                                                </div>
                                                <div className='w-full text-xl flex-col'>Cities we deliver : {(product.city.join(', '))}</div>
                                            </div>
                                            <div className='ml-auto  h-6' onClick={() => {
                                                RemoveItem(product.id)
                                            }} >
                                                <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 bg-red-500' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </div>
                                            
                                        
                                        </div>
                                    </div>
                                })}
                                       
                            </div>
                            <div className='flex justify-center'>
                            <button type="button"
                            onClick={removeAllOutOfStock}
                            className={`text-white  flex bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center
                            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>
                            
                                <span className="sr-only sm:not-sr-only">Remove all of them from current order and Proceed </span>
                            
                        </button>
                        </div>


                        </div>


                    </div>
                </div>
            </div>
  }
        
        <div className='p-11 flex-col justify-center items-center'> 
        <div className='flex flex-col lg:flex-row lg:flex-wrap lg:gap-6'>
        {addresses.length>0 && addresses.map((Address) => {
            return (
                <div className='mb-4'>

        
<ul onClick={setForm}  
className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <div className="flex items-center pl-3">
            <input id={`${Address.id}`} onChange={() =>{
                setSelectedAddress(Address)
            } } type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
            <label for="list-radio-license" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                <div>
                    <p>{Address.street}</p>
                    <p>{Address.area}</p>
                    <p>{Address.city}</p>
                    <p>{Address.phone_no}</p>
                </div>
            </label>
        </div>
    </li>

</ul>
</div>  
            )
        })}
        {/* add new address */}
        
        <div onClick={() => {
            console.log("triggered  ")
            if(document.querySelector('.addAddress').classList.contains('hidden')){
                document.querySelector('.addAddress').classList.remove('hidden')
            }
            else{
                document.querySelector('.addAddress').classList.add('hidden')
            }
        }} className='w-fit h-fit mb-8 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" className='w-11 h-11' stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

        </div>
</div>
<div className='addAddress hidden'>
            
<form id="addressForm" >
    <div className='flex-col justify-center items-center'>
  <div className="relative z-0 w-full mb-6 group p-2">
      <input type="text"  name="street" id="floating_email" className="block   px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-blue-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
      <label for="floating_email" className=" peer-focus:font-medium absolute text-sm text-black-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Street No</label>
  </div>
  <div className="relative z-0 w-full mb-6 group p-2">
      <input type="text"  name="area" id="floating_password" className="block  px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-blue-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
      <label for="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Area </label>
  </div>
  <div className="relative z-0 w-full mb-6 group p-2">
      <input type="text"  name="city" id="floating_repeat_password" className="block  px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-blue-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
      <label for="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
  </div>
  <div className="grid md:grid-cols-2 md:gap-6 p-2">
    <div className="relative z-0 w-full mb-6 group">
        <input type="number"  name="phone_no" id="floating_first_name" className="block  px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-blue-500 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone no:</label>
    </div>
    
  </div>
  
  <button type="submit" onClick={(e) => validate(e)} className="mb-4 text-black-700 bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add address</button>
  </div>
</form>

</div>
<button type="submit" onClick={checkAndContinue} className={`${selectedAddress===undefined || selectedAddress.length===0 ? "cursor-not-allowed" : ""}  text-black-700 bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}>Proceed to Buy</button>

</div>

    </div>
  )
}

