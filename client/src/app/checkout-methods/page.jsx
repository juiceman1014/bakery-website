import React from "react";

const Checkout = () => {
    return(
        <div className = "flex flex-row justify-center items-center h-screen">
        <container className = "flex flex-col justify-center items-center bg-orange-100 h-3/6 w-6/12 justify-evenly">
            <button className = "h-1/6 w-6/12 bg-slate-100">Pickup</button>
            <button className = "h-1/6 w-6/12 bg-slate-100">Delivery</button>
        </container>
        </div>
    );
};

export default Checkout