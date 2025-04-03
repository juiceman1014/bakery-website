import React from "react";
import Link from "next/link";

const Checkout = () => {
  return (
    <>
      <div className="flex flex-row justify-center items-center h-screen bg-orange-50">
        <div className="flex flex-col justify-center items-center bg-orange-100 h-[500px] w-[500px] rounded-lg shadow-lg p-6">
          <div className="flex flex-col w-10/12 mt-4 space-y-4">
            <Link href="/checkout-methods/delivery" className="w-full">
              <button className="w-full bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
                Delivery
              </button>
            </Link>
            <Link href="/checkout-methods/pickup" className="w-full">
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-200">
                Pick Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
