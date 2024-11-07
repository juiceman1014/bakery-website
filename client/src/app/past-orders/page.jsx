"use client";

import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";

const PastOrders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});

  useEffect(() => {
    const fetchPastOrders = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/past-order/${user.ID}`
          );
          console.log("Fetched orders:", response.data);
          setOrders(response.data);

          const grouped = response.data.reduce((acc, order) => {
            const { order_ID } = order;
            if (!acc[order_ID]) {
              acc[order_ID] = [];
            }
            acc[order_ID].push(order);
            return acc;
          }, {});

          console.log("Grouped orders:", grouped);
          setGroupedOrders(grouped);
        } catch (error) {
          console.error("Error fetching past orders: ", error);
        }
      }
    };
    fetchPastOrders();
  }, [user]);

  if (!user) {
    return <div>Please log in to start tracking past orders.</div>;
  }

  return (
    <>
      <h1 className="text-center">Past Orders</h1>
      <div className="h-screen flex flex-col items-center justify-evenly">
        {Object.keys(groupedOrders).length === 0 ? (
          <div>No past orders found.</div>
        ) : (
          Object.keys(groupedOrders).map((orderID) => (
            <div key={orderID} className="border-[2px] border-[black] p-4 mb-4">
              <h2>
                Order Date:{" "}
                {new Date(
                  groupedOrders[orderID][0].order_date
                ).toLocaleDateString()}
              </h2>

              {groupedOrders[orderID].map((item, index) => (
                <div
                  key={index}
                  className="border-t-[1px] border-[gray] mt-2 pt-2"
                >
                  <div>Item: {item.item_name}</div>
                  <div>Quantity: {item.quantity}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PastOrders;
