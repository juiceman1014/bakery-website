import React from "react";
import Link from "next/link";

const Cart = () => {
  return (
    <>
       <div className="flex flex-row justify-center items-center h-screen break-normal">
        <container className="flex flex-col justify-center items-center bg-orange-100 h-[500px] w-[500px] justify-evenly">
          
            <div className="h-1/6 w-6/12 bg-slate-100 flex flex-col justify-center">
              <div className = "flex justify-between">
                <p>Item1</p>
                <p>Price</p>
              </div>
              <div className = "flex justify-between">
                <p>Item2</p>
                <p>Price</p>
              </div>
              <div className = "flex justify-between">
                <p>Item3</p>
                <p>Price</p>
              </div>
            </div>
          

            <div className="h-1/6 w-6/12 bg-slate-100 flex flex-col justify-center">
            <div className = "flex justify-between">
                <p>Subtotal</p>
                <p>Price</p>
             </div>
             <div className = "flex justify-between">
                <p>Tax</p>
                <p>Price</p>
              </div>
              <div className = "flex justify-between">
                <p>Total</p>
                <p>Price</p>
              </div>
            </div>

          <div className = "flex justify-between w-6/12">
          <Link
            href="/checkout-methods/delivery"
            className="bg-white flex justify-center"
          >
            <button>Order More</button>
          </Link>
          <Link
            href="/checkout-methods"
            className="bg-white flex justify-center"
          >
            <button>Checkout</button>
          </Link>
          </div>
      </container>
    </div>
    </>
  );
};

export default Cart;
