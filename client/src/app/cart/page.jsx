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
      <div className="flex flex-row justify-center items-center h-screen">
        <container className="flex flex-col justify-center items-center bg-orange-100 h-[500px] w-[500px] my-auto justify-evenly">
          
          <div className="h-1/6 w-6/12 flex flex-col justify-center">
          {cartItems.map((item) => (
            <div key = {item.ID} className="flex justify-between">
              <p>{item.item_name}</p>
              <p>{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button
              onClick = {() => handleDelete(item.ID)}
              className = "text-[red]"
              >
                X
              </button>
            </div>
          ))}
        
            <div className="flex justify-between">
              <p>Total</p>
              <p>${total}</p>
            </div>
          </div>

          <div className="flex justify-between w-6/12">
            <Link
              href="/menu"
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
