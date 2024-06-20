import React from "react";
import Link from "next/link"

const Checkout = () => {
    return(
        <div className = "flex flex-row justify-center items-center h-screen">
        <container className = "flex flex-col justify-center items-center bg-orange-100 h-3/6 w-6/12 justify-evenly">

        
        <Link href = "/checkout-methods/pickup">
            <button className = "bg-slate-100 w-[100px] h-[100px]">
                Pickup
            </button>
        </Link>
        

        <button className = "h-1/6 w-6/12 bg-slate-100">
            <Link href = "/checkout-methods/delivery">Delivery</Link>
        </button>
        </container>
        </div>
    );
};

export default Checkout