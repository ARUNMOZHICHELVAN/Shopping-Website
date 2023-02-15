// import { Outlet, Navigate } from "react-router-dom"

// const ProtectedRoute = () => {
//     console.log("local storage token", window.localStorage.getItem("token"))
//     return (
//         //Outlet means go ahead and render the child components 
//         //This is a more cleaner verion used in the react-router-dom
//         window.localStorage.getItem("token") ? <Outlet /> : <Navigate to='/Login' />
//     )
// }
// export default ProtectedRoute
import React, { useEffect } from "react";
import { Redirect, Route, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem("token");
    console.log("this", isAuthenticated);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
        }
    }, [])

    return (

        <>
            {children}
        </>
    );
}

export default ProtectedRoute;
