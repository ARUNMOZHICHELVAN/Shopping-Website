import { createContext, useContext, useEffect, useState } from "react";
import productdata from "./data.json";


export const cartContext = createContext(null);

export const useCartContext = () => useContext(cartContext);

function CartContext({ children }) {
    const [cartProduct, setCartProducts] = useState([]);

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
    async function addOneToCart(id, count) {
        console.log("id ", id)
        console.log("count ", count)
        const product = getProductQuantity(id)
        const addtoDB = await fetch('https://shopping-website-04lb.onrender.com/addOneToCart', {
            method: 'POST',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                //stringify converts Javascript objects to JSON OBJECT
                email: window.localStorage.getItem("user"),
                token: window.localStorage.getItem("token"),
                item_id: id,
                item_count: count
            })
        })

        console.log("added to db ", JSON.stringify(addtoDB))
        // addtoDB()
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
                    return product
                })
            )
        }
        cartProduct.map((product) => {
            console.log("cart PROODUCT :" + product.id)
            return product
        })
    }


    async function removeOneFromCart(id) {
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

    async function deleteFromCart(id, setproducts, setx, x) {
        const quantity = getProductQuantity(id);

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
        setCartProducts(cartProduct.filter((product) => {
            //true means include
            return product.id !== id;
        }))
    }

    function getTotalCost(productsincart) {
        let cost = 0

        for (var i = 0; i < productsincart.length; i++) {
            console.log("car " + productdata[i].product_price)
            cost += productdata.find((product) => {
                return product.id === productsincart[i].id
            }).product_price * productsincart[i].count;
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