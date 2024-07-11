import React from "react";
import Link from "next/link";

const menu = () => {
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
        <h1 className = "text-2xl text-center">Mooncake</h1>
        <mooncakecontainer id = "mooncake" className = "flex flex-col">
          <mooncake className = "flex flex-row"> 
            <img className = "h-[200px] w-auto" src="https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg"></img>
            <div className = "flex flex-col justify-between">
              <p>Name</p>
              <p>Price</p>
              <p>Description</p>
            </div>
            <button className = "pr-[20px] ml-auto">add to cart</button>
          </mooncake>
          <mooncake className = "flex flex-row"> 
            <img className = "h-[200px] w-auto" src="https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg"></img>
            <div className = "flex flex-col justify-between">
              <p>Name</p>
              <p>Price</p>
              <p>Description</p>
            </div>
            <button className = "pr-[20px] ml-auto">add to cart</button>
          </mooncake>
          <mooncake className = "flex flex-row"> 
            <img className = "h-[200px] w-auto" src="https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg"></img>
            <div className = "flex flex-col justify-between">
              <p>Name</p>
              <p>Price</p>
              <p>Description</p>
            </div>
            <button className = "pr-[20px] ml-auto">add to cart</button>
          </mooncake>
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

        <h1 className = "mt-[20px] text-2xl text-center">Cheesecake</h1>
        <cheesecakecontainer id = "cheesecake" className = "flex flex-col">
          <cheesecake className = "flex flex-row"> 
            <img className = "h-[200px] w-auto" src="https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg"></img>
            <div className = "flex flex-col justify-between">
              <p>Name</p>
              <p>Price</p>
              <p>Description</p>
            </div>
            <button className = "pr-[20px] ml-auto">add to cart</button>
          </cheesecake>
          <cheesecake className = "flex flex-row"> 
            <img className = "h-[200px] w-auto" src="https://cdn.theatlantic.com/media/mt/science/cat_caviar.jpg"></img>
            <div className = "flex flex-col justify-between">
              <p>Name</p>
              <p>Price</p>
              <p>Description</p>
            </div>
            <button className = "pr-[20px] ml-auto">add to cart</button>
          </cheesecake>
        </cheesecakecontainer>

        
      </container>
    </>
  );
};

export default menu;
