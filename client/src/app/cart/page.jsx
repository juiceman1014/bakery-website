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
          const response = await axios.get(`http://localhost:8000/cart/${user.ID}`);
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
