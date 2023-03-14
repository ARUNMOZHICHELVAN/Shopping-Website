import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from "react-toastify"
// const App = React.lazy(() => import('./App'))
import App from "./App"
import Cart from "./Cart"
import Success from './Success'
import Failure from './Failure'
import Orders from './Order'
import { CartContext } from './CartContext'
import OrderDetails from './OrderDetails'
import Login from './Login'
import Register from './Register'
import Welcome from './Welcome'
import PasswordChange from './PasswordChange'
import ProtectedRoute from './ProtectedRoute'

function App2() {
    return (

        <CartContext>
            <ToastContainer />
            <BrowserRouter>
            <Routes>

                    <Route path='/' element={<Welcome />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/Password-change' element={<PasswordChange />} />
                    <Route path='/register' element={<Register />} />
                    {/* <Route element={<ProtectedRoute />} > */}
                    <Route path='/Home' element={
                        <ProtectedRoute>
                            <App />
                        </ProtectedRoute>
                    } />
                    <Route path='/Cart' element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    } />
                    <Route path='/Cart/Success' element={
                        <ProtectedRoute>
                            <Success />
                        </ProtectedRoute>
                    } />
                    <Route path='/Cart/Failure' element={
                        <ProtectedRoute>
                            <Failure />
                        </ProtectedRoute>
                    } />
                    <Route path='Orders' element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    } />
                    <Route path='Orders/:id' element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    } />
                    {/* </Route> */}
                    {/* <ProtectedRoute exact path='/home' component={App2} /> */}
                </Routes>
                {/* </Suspense> */}
            </BrowserRouter>
            {/* </ToastContainer> */}
        </CartContext>

    )
}

export default App2


