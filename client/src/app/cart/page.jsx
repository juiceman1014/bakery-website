"use client";

import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../context/UserContext.jsx";

const Cart = () => {
  const{user} = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async() => {
      if (user) {
        try{
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${user.ID}`);
          setCartItems(response.data);
        } catch(error){
          console.error("There was an error fetching the cart items!", error);
        }
      } else{
        const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        setCartItems(guestCart);
      }
    };
    
    fetchCartItems();
  }, [user]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleDelete = async (item_ID) => {
    console.log("deleting item with ID " + item_ID);
    if(user) {
      try{
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
          params: {user_ID: user.ID, item_ID}
        });
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${user.ID}`);
        setCartItems(response.data);
      } catch(error){
        console.error("There was an error deleting the cart item!", error);
      }
    } else {
      const updatedCart = cartItems.filter(item => item.ID !== item_ID);
      localStorage.setItem('guest_cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  }

  const total = calculateTotal();
  

  return (
    <>
      <div className="flex flex-row justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col justify-center items-center bg-orange-100 h-[500px] w-[500px] rounded-lg shadow-lg p-6">
          
          {/* Cart Items */}
          <div className="h-1/2 w-10/12 flex flex-col space-y-3 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.ID} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold">{item.item_name}</p>
                  <p className="text-gray-600">${item.price}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.ID)}
                  className="text-red-500 font-bold text-lg hover:text-red-700 transition duration-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
  
          {/* Total Price */}
          <div className="w-10/12 flex justify-between items-center text-lg font-semibold mt-4 border-t pt-2">
            <p>Total:</p>
            <p>${(Number(total) || 0).toFixed(2)}</p>
          </div>
  
          {/* Buttons */}
          <div className="flex justify-between w-10/12 mt-4 space-x-4">
            <Link href="/menu" className="w-1/2">
              <button className="w-full bg-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
                Order More
              </button>
            </Link>
            <Link href="/checkout-methods" className="w-1/2">
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-200">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );  
};

export default Cart;
