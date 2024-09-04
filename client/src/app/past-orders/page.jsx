"use client";

import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";

const PastOrders = () => {
    const{user} = useContext(UserContext);
    const[orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchPastOrders = async () => {
            if(user){
                try{
                    const response = await axios.get(`http://localhost:8000/past-order/${user.ID}`);
                    setOrders(response.data);
                } catch(error){
                    console.error("Error fetching past orders: ", error);
                }
            }
        };
        fetchPastOrders();
    }, [user]);

    if(!user){
        return<div>Please log in to start tracking past orders.</div>
    }

    return(
        <>
            <h1 className = "text-center">Past Orders</h1>
            <div className = "h-screen flex flex-col justify-evenly">
                {orders.length === 0 ? (
                    <div>No past orders found.</div>
                ) : (
                    orders.map((order, index) => (
                        <div key = {index} className = "border-[2px] border-[black]">
                            <div>Item: {order.item_name}</div>
                            <div>Quantity: {order.quantity}</div>
                            <div>Date: {new Date(order.order_date).toLocaleDateString()}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default PastOrders