// import { PRERENDER_MANIFEST } from "next/dist/shared/lib/constants";
import { createContext, useContext, useEffect, useState } from "react";
import { productdata } from "./data";
// import cart from "./Cart";
// import Product from "./Product";

export const cartContext = createContext(null);

export const useCartContext = () => useContext(cartContext);

function CartContext({ children }) {
    const [cartProduct, setCartProducts] = useState([]);
    // const fetchdata = async () => {
    //     const data = await fetch('http://localhost:5000/getCart', {
    //         method: 'POST',
    //         headers: { "Content-type": "application/json; charset=UTF-8" },
    //         body: JSON.stringify({
    //             email: window.localStorage.getItem("user")
    //         })
    //     })
    //     const data2 = await data.json()
    //     setCartProducts(data2)
    // }
    // useEffect(() => {
    //     fetchdata();
    // }, [])


    // console.log("Restored Cart Products : ", data2)
    // setCartProducts(data2)

    //The cart products shoudl not be empty it should be set to the cartProducts field of the loggged in user
    //For that first fetch the cartproducts from the database



    console.log("CART PRODUCTS  " + cartProduct)
    function getProductQuantity(id) {
        const product = cartProduct.find((product) => product.id === id)
        if (product === undefined) {
            return 0;
        }
        else {
            return product.quantity;
        }
    }
    function addOneToCart(id, count) {
        const product = getProductQuantity(id);
        if (product === 0) {
            //product not in cart
            setCartProducts([
                ...cartProduct,
                {
                    id: id,
                    quantity: count
                }
            ])
        }
        else {
            //product already in cart
            setCartProducts(
                cartProduct.map((product) => {
                    if (product.id === id) {
                        return {
                            ...product,
                            quantity: product.quantity + count
                        }
                    }
                    else {
                        return product
                    }
                })
            )
        }
        console.log("cart " + CartContext)
        cartProduct.map((product) => {
            console.log("cart PROODUCT :" + product.id)
            return product
        })
    }


    function removeOneFromCart(id) {
        const quantity = getProductQuantity(id);
        if (quantity === 1) {
            deleteFromCart(id)
        }
        else {
            setCartProducts(cartProduct.map((product) => {
                if (product.id === id) {
                    return {
                        ...product,
                        quantity: product.quantity + 1
                    }
                }
                return product
            }))
        }

    }

    function deleteFromCart(id) {
        const quantity = getProductQuantity(id);
        setCartProducts(cartProduct.filter((product) => {
            //true means include
            return product.id !== id;
        }))
    }

    function getTotalCost() {
        let cost = 0
        for (var i = 0; i < cartProduct.length; i++) {
            console.log("car " + productdata[i].product_price)
            cost += productdata.find((product) => {
                return product.id === cartProduct[i].id
            }).product_price * getProductQuantity(cartProduct[i].id);
        }
        console.log("COST " + cost);
        return cost
    }
    const contextValue = {
        items: cartProduct,
        getProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        getTotalCost
    }
    return (
        <cartContext.Provider value={contextValue}>
            {children}
        </cartContext.Provider>
    )
}
export { CartContext }