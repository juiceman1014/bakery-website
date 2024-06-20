import React from "react";
import Link from "next/link";

const Checkout = () => {
  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <container className="flex flex-col justify-center items-center bg-orange-100 h-3/6 w-6/12 justify-evenly">
        <Link
          href="/checkout-methods/pickup"
          className="h-1/6 w-6/12 bg-slate-100 flex justify-center"
        >
          <button>Pick up</button>
        </Link>

        <Link
          href="/checkout-methods/delivery"
          className="h-1/6 w-6/12 bg-slate-100 flex justify-center"
        >
          <button>Delivery</button>
        </Link>
      </container>
    </div>
  );
};

export default Checkout;
