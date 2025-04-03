"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../context/UserContext.jsx";

const Menu = () => {
  const [mooncakes, setMooncakes] = useState([]);
  const [cheesecakes, setCheesecakes] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/menu`
        );
        const items = response.data;

        const mooncakeItems = items.filter(
          (item) => item.category === "mooncake"
        );
        const cheesecakeItems = items.filter(
          (item) => item.category === "cheesecake"
        );

        setMooncakes(mooncakeItems);
        setCheesecakes(cheesecakeItems);
      } catch (error) {
        console.error("There was an error fetching the menu items!", error);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = async (item) => {
    if (user) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
          {
            user_ID: user.ID,
            item_ID: item.id,
            quantity: 1,
          }
        );
        alert(response.data.message);
      } catch (error) {
        console.error(
          "There was an error adding the item to the cart and past orders!",
          error
        );
      }
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const existingItem = guestCart.find(
        (cartItem) => cartItem.ID === item.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.push({
          ID: item.id,
          item_name: item.item_name,
          price: item.price,
          quantity: 1,
        });
      }

      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      alert("Item added to cart!");
    }
  };

  const renderItems = (items) =>
    items.map((item) => (
      <div
        key={item.ID}
        className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col md:flex-row gap-4"
      >
        <img
          className="h-[200px] w-auto object-cover rounded"
          src={item.photo}
          alt={item.item_name}
        />
        <div className="flex flex-col justify-between">
          <h3 className="text-xl font-semibold">{item.item_name}</h3>
          <p className="text-gray-600">Price: ${item.price}</p>
          <p className="text-gray-700">{item.description}</p>
        </div>
        <div className="ml-auto flex items-end">
          <button
            onClick={() => addToCart(item)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    ));

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <Link
          href="#mooncake"
          className="bg-orange-200 hover:bg-orange-300 px-4 py-2 rounded text-sm font-medium"
        >
          Mooncake
        </Link>
        <Link
          href="#cheesecake"
          className="bg-orange-200 hover:bg-orange-300 px-4 py-2 rounded text-sm font-medium"
        >
          Cheesecake
        </Link>
      </div>

      {/* Mooncake Section */}
      <section id="mooncake" className="mb-10">
        <h2 className="text-3xl font-bold text-center mb-6">Mooncake</h2>
        <div className="grid gap-6 md:grid-cols-2">{renderItems(mooncakes)}</div>
      </section>

      {/* Cheesecake Section */}
      <section id="cheesecake">
        <h2 className="text-3xl font-bold text-center mb-6">Cheesecake</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {renderItems(cheesecakes)}
        </div>
      </section>
    </div>
  );
};

export default Menu;
