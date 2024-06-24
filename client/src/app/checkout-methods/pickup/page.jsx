import React from "react";
import Link from "next/link";

const Pickup = () => {
  return (
    <>
      <div className="flex flex-row justify-center items-center h-screen">
        <container className="flex flex-col justify-center items-start bg-orange-100 h-[500px] w-[500px] justify-evenly my-auto">
          <div className="flex flex-col ml-[3rem]">
            <p>Pickup Name: </p>
            <input className = "w-[300px]"></input>
          </div>

          <div className="flex flex-col ml-[3rem]">
            <p>Email Address: </p>
            <input className = "w-[300px]" ></input>
          </div>

          <div className="flex flex-col ml-[3rem]">
            <p>Phone Number: </p>
            <input className = "w-[300px]"></input>
          </div>

        </container>
      </div>
    </>
  );
};

export default Pickup;
