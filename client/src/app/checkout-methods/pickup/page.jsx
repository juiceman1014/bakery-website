"use client";

import React, { useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../../context/UserContext.jsx";

const Pickup = () => {
  const { user } = useContext(UserContext);
  const [pickupDetails, setPickupDetails] = useState ({
    name: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPickupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    let cartItems = [];

    if(user){
      try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${user.ID}`);
        cartItems = response.data;
      }catch(error){
        console.error("Error fetching user cart:", error);
        return;
      }
    } else{
      cartItems = JSON.parse(localStorage.getItem("guest_cart")) || [];
    }

    try{
      const [submitOrderResponse, fillPastOrderResponse] = await Promise.all([

        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit-order-pickup`, {
        user_ID: user ? user.ID : null,
        cartItems: cartItems,
        pickupDetails: pickupDetails
        }),

        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fill-past-order`, {
          user_ID: user ? user.ID : null,
          cartItems: cartItems,
          order_date: today
        })

      ]);

      if (submitOrderResponse.data.status === "success"){
        alert("Order placed successfully!");
          if(user){
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart-clear/${user.ID}`);
             window.location.href = "/cart"
          } else{
            localStorage.removeItem("guest_cart");
            window.location.href = "/cart";
          }
      }
    } catch(error){
      console.error("Error placing order:", error);
      alert("There was an issue placing your order. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen mt-20">
        <form 
        onSubmit = {handleSubmit}
        className="flex flex-col justify-center items-start bg-orange-100 h-[500px] w-[500px] justify-evenly"
        >
          <div className="flex flex-col ml-[3rem]">
            <p>Pickup Name: </p>
            <input 
            className="w-[300px]"
            name="name"
            value={pickupDetails.name}
            onChange={handleInputChange}
            required
            >
            </input>
          </div>

          <div className="flex flex-col ml-[3rem]">
            <p>Email Address: </p>
            <input 
            className="w-[300px]"
            name="email"
            type="email"
            value={pickupDetails.email}
            onChange={handleInputChange}
            required
            >
            </input>
          </div>

          <div className="flex flex-col ml-[3rem]">
            <p>Phone Number: </p>
            <input 
            className="w-[300px]"
            name="phone"
            type="tel"
            value={pickupDetails.phone}
            onChange={handleInputChange}
            required
            >
            </input>
          </div>

          <div className="flex justify-end w-full pr-[3rem]">
            <button 
            type = "submit"
            className = "bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>

        <img className="h-[300px] w-auto" src="/venmo-QR.jpg"></img>
      </div>
    </>
  );
};

export default Pickup;
