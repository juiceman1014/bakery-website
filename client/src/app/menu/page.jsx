import React from "react";
import Link from "next/link";

const menu = () => {
  return (
    <>
      <container className = "h-screen w-screen">
        <div className="flex flex-row justify-end">
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="#about">Mooncake</Link>
          </button>
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="#contact">Cheesecake</Link>
          </button>
        </div>
        <h1 className = "text-2xl text-center">Mooncake</h1>
        <mooncakecontainer className = "flex flex-col">
          <mooncake className = "flex flex-row"> 
            <img className = "h-[200px] w-auto" src="https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg"></img>
            <div className = "flex flex-col justify-between">
              <p>Name</p>
              <p>Price</p>
              <p>Description</p>
            </div>
            <button className = "pr-[20px] ml-auto">add to cart</button>
          </mooncake>
        </mooncakecontainer>
      </container>
    </>
  );
};

export default menu;
