import React from "react";
import Link from "next/link";

const Pickup = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen mt-20">
        <container className="flex flex-col justify-center items-start bg-orange-100 h-[500px] w-[500px] justify-evenly">
          <div className="flex flex-col ml-[3rem]">
            <p>Pickup Name: </p>
            <input className="w-[300px]"></input>
          </div>

          <div className="flex flex-col ml-[3rem]">
            <p>Email Address: </p>
            <input className="w-[300px]"></input>
          </div>

          <div className="flex flex-col ml-[3rem]">
            <p>Phone Number: </p>
            <input className="w-[300px]"></input>
          </div>

          <div className="flex justify-end w-full pr-[3rem]">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </container>

        <img className="h-[300px] w-auto" src="/venmo-QR.jpg"></img>
      </div>
    </>
  );
};

export default Pickup;
