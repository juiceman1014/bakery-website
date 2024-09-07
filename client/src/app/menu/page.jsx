"use client";

import React, { useEffect, useState, useContext} from "react";
import axios from "axios";
import Link from "next/link";
import { UserContext } from "../context/UserContext.jsx";

const Menu = () => {
  const [mooncakes,setMooncakes] = useState([]);
  const [cheesecakes, setCheesecakes] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchMenuItems = async() => {
      try{
        const response = await axios.get("http://localhost:8000/menu")
        const items = response.data;

        const mooncakeItems = items.filter(item => item.category === "mooncake");
        const cheesecakeItems = items.filter(item => item.category === 'cheesecake');

        setMooncakes(mooncakeItems);
        setCheesecakes(cheesecakeItems);
      } catch (error) {
        console.error("There was an error fetching the menu items!", error);
      }
    };
    
    fetchMenuItems();
  }, []);

  const addToCart = async (item) => {
    
    if(user){
      try{
        const response = await axios.post("http://localhost:8000/cart", {
            user_ID: user.ID,
            item_ID: item.ID,
            quantity: 1
          });
        alert(response.data.message);
      } catch(error){
        console.error("There was an error adding the item to the cart and psat orders!", error);
      }
    } else{
      let guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
      const existingItem = guestCart.find(cartItem => cartItem.ID === item.ID);

      if(existingItem){
        existingItem.quantity += 1;
      }else{
        guestCart.push({
          ID: item.ID,
          item_name: item.item_name,
          price: item.price,
          quantity: 1
        });
      }

      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      alert("Item added to cart!");
    }
  };
  
  return (
    <>
      <container className = "h-screen w-screen">
        <div className="flex flex-row justify-end">
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="#mooncake">Mooncake</Link>
          </button>
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="#cheesecake">Cheesecake</Link>
          </button>
        </div>

        <div id = "mooncake" className = "flex flex-col">
          <h1 className = "text-2xl text-center">Mooncake</h1>
          <div className = "flex flex-col"> 
            {mooncakes.map(item => (
              <div key = {item.ID} className = "flex flex-row my-4">
              <img className = "h-[200px] w-auto" src={item.photo} alt={item.item_name}></img>
              <div className = "flex flex-col justify-between">
                <p>Name: {item.item_name}</p>
                <p>Price: {item.price}</p>
                <p>Description: {item.description}</p>
              </div>
              <button className = "pr-[20px] ml-auto" onClick = {() => addToCart(item)}>add to cart</button>
            </div>
            ))}
          </div>
        </div>

        <div id = "cheesecake" className = "flex flex-col">
          <h1 className = "text-2xl text-center">Cheesecake</h1>
          <div className = "flex flex-col"> 
            {cheesecakes.map(item => (
              <div key = {item.ID} className = "flex flex-row my-4">
              <img className = "h-[200px] w-auto" src={item.photo} alt={item.item_name}></img>
              <div className = "flex flex-col justify-between">
                <p>Name: {item.item_name}</p>
                <p>Price: {item.price}</p>
                <p>Description: {item.description}</p>
              </div>
              <button className = "pr-[20px] ml-auto" onClick = {() => addToCart(item)}>add to cart</button>
            </div>
            ))}
          </div>
        </div>

      </container>
    </>
  );
};

export default Menu;
