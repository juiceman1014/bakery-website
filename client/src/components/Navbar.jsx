"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../app/context/UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const { logout } = useContext(UserContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-screen">
      <div className="flex flex-col justify-between h-full w-24 bg-orange-100 items-center py-4 fixed">
        <div className="hover:bg-orange-200 p-2 rounded-full">
          <button>
            <Link href="/">
              <img
                className="h-16 w-16 rounded-full"
                src="/mooncake-sample-logo.jpeg"
                alt="Mooncake Logo"
              />
            </Link>
          </button>
        </div>

        <div>
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="/menu">Menu/Order</Link>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-2">
          {user ? (
            <>
              <div className="rounded-md text-sm font-medium break-words w-20">{user.email}</div>
              <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium" onClick={handleLogout}>
                Logout
              </button>
              <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
                <Link href="/past-orders">Past Orders</Link>
              </button>
            </>
          ) : (
            <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
              <Link href="/login">Login</Link>
            </button>
          )}
        </div>

        <div className="hover:bg-orange-200 p-2 rounded-full">
          <button>
            <Link href="/cart">
              <img
                className="h-16 w-16 rounded-full"
                src="/cart-sample-logo.jpeg"
                alt="Cart Logo"
              />
            </Link>
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
