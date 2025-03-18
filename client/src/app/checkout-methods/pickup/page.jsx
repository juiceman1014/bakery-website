"use client";

import React, { useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../../context/UserContext.jsx";

const Pickup = () => {
  const { user } = useContext(UserContext);
  const [pickupDetails, setPickupDetails] = useState({
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
    const today = new Date().toISOString().split("T")[0];

    let cartItems = [];

    if (user) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${user.ID}`
        );
        cartItems = response.data;
      } catch (error) {
        console.error("Error fetching user cart:", error);
        return;
      }
    } else {
      cartItems = JSON.parse(localStorage.getItem("guest_cart")) || [];
    }

    try {
      const [submitOrderResponse, fillPastOrderResponse] = await Promise.all([
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/submit-order-pickup`,
          {
            user_ID: user ? user.ID : null,
            cartItems: cartItems,
            pickupDetails: pickupDetails,
          }
        ),
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fill-past-order`, {
          user_ID: user ? user.ID : null,
          cartItems: cartItems,
          order_date: today,
        }),
      ]);

      if (submitOrderResponse.data.status === "success") {
        alert("Order placed successfully!");
        if (user) {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart-clear/${user.ID}`
          );
          window.location.href = "/cart";
        } else {
          localStorage.removeItem("guest_cart");
          window.location.href = "/cart";
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an issue placing your order. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-orange-100 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Pickup Details
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Pickup Name:
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            name="name"
            value={pickupDetails.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Email Address:
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            name="email"
            type="email"
            value={pickupDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">
            Phone Number:
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            name="phone"
            type="tel"
            value={pickupDetails.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit Order
        </button>
      </form>

      <div className="mt-6">
        <Link
          href="https://venmo.com/u/ptdanh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
        >
          Pay via Venmo
        </Link>
      </div>
    </div>
  );
};

export default Pickup;
