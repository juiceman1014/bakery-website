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

    let cartItems = [];

    if(user){
      try{
        const response = await axios.get(`http://localhost:8000/cart/${user.ID}`);
        cartItems = response.data;
      }catch(error){
        console.error("Error fetching user cart:", error);
        return;
      }
    } else{
      cartItems = JSON.parse(localStorage.getItem("guest_cart")) || [];
    }

    try{
      const response = await axios.post("http://localhost:8000/submit-order-pickup", {
        user_ID: user ? user.ID : null,
        cartItems: cartItems,
        pickupDetails: pickupDetails,
      });

      if (response.data.status === "success"){
        alert("Order placed successfully!");
          if(user){
            await axios.delete(`http://localhost:8000/cart-clear/${user.ID}`);
             window.location.href = "/cart"
          } else{
            localStorage.removeItem("guest_cart");
            window.location.href = "/cart";
          }
      }else if(response.data.status === "error"){
        alert(response.data.message);
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
