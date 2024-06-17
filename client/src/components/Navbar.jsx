import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className=" shrink-0">
      {/* do not add fixed over here tyvm*/}
      <div className="flex flex-col justify-between h-full w-24 bg-orange-100 items-center py-4">
        <div className="hover:bg-orange-200 p-2 rounded-full">
          <Link href="/">
            <img
              className="h-16 w-16 rounded-full"
              src="/mooncake-sample-logo.jpeg"
              alt="Mooncake Logo"
            />
          </Link>
        </div>
        <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
          <Link href="/menu">Menu/Order</Link>
        </button>
        <div className="flex flex-col space-y-2">
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="/about">About</Link>
          </button>
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            Contact
          </button>
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            Login
          </button>
        </div>
        <div className="hover:bg-orange-200 p-2 rounded-full">
          <button>
            <img
              className="h-16 w-16 rounded-full"
              src="/cart-sample-logo.jpeg"
              alt="Cart Logo"
            />
          </button>
        </div>
        <div className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
          <button>Translate</button>
        </div>
        <div className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
          <button>Anh Danh © 2024</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
