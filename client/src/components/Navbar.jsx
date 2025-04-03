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
      <div className="fixed top-0 left-0 h-full w-24 bg-orange-50 flex flex-col justify-between items-center py-6">

        {/* Logo */}
        <Link href="/" className="hover:bg-orange-200 p-2 rounded-full transition">
          <img
            src="/mooncake-sample-logo.jpeg"
            alt="Mooncake Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col items-center space-y-4 mt-4">
          <Link
            href="/menu"
            className="hover:bg-orange-200 text-sm font-medium p-2 rounded-md transition"
          >
            Menu
          </Link>
        </nav>

        {/* User Section */}
        <div className="flex flex-col items-center space-y-3">
          {user ? (
            <>
              <p className="text-xs text-center w-20 break-words font-medium text-gray-700">
                {user.email}
              </p>

              <button
                onClick={handleLogout}
                className="hover:bg-orange-200 text-sm font-medium p-2 rounded-md transition"
              >
                Logout
              </button>

              <Link
                href="/past-orders"
                className="hover:bg-orange-200 text-sm font-medium p-2 rounded-md transition"
              >
                Past Orders
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="hover:bg-orange-200 text-sm font-medium p-2 rounded-md transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Cart Icon */}
        <Link href="/cart" className="hover:bg-orange-200 p-2 rounded-full transition">
          <img
            src="/cart-sample-logo.jpeg"
            alt="Cart Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
        </Link>

        {/* Footer Buttons */}
        <div className="flex flex-col items-center space-y-2 text-center text-xs font-medium text-gray-700">
          <button className="hover:bg-orange-200 px-2 py-1 rounded-md transition">
            Translate
          </button>
          <span className="text-[10px] text-gray-500">Anh Danh © 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
