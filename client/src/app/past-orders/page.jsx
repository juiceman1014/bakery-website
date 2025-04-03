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
          setOrders(response.data);

          const grouped = response.data.reduce((acc, order) => {
            const { order_ID } = order;
            if (!acc[order_ID]) {
              acc[order_ID] = [];
            }
            acc[order_ID].push(order);
            return acc;
          }, {});

          setGroupedOrders(grouped);
        } catch (error) {
          console.error("Error fetching past orders: ", error);
        }
      }
    };
    fetchPastOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center text-gray-700 mt-10">
        Please log in to start tracking past orders.
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto p-6 bg-orange-50">
      <h1 className="text-center text-2xl font-bold mb-6">Past Orders</h1>
      <div className="flex flex-col gap-6">
        {Object.keys(groupedOrders).length === 0 ? (
          <div className="text-center text-gray-500">No past orders found.</div>
        ) : (
          Object.keys(groupedOrders).map((orderID) => (
            <div
              key={orderID}
              className="border border-gray-300 shadow-md p-4 rounded-lg bg-white max-w-md mx-auto"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                Order Date:{" "}
                {new Date(
                  groupedOrders[orderID][0].order_date
                ).toLocaleDateString()}
              </h2>
              <div className="mt-3 space-y-2">
                {groupedOrders[orderID].map((item, index) => (
                  <div key={index} className="border-t border-gray-200 pt-2">
                    <div className="text-gray-700">
                      Item:{" "}
                      <span className="font-medium">{item.item_name}</span>
                    </div>
                    <div className="text-gray-700">
                      Quantity:{" "}
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastOrders;
