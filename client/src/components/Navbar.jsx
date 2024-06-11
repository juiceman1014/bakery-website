import React from "react";
import mooncakeLogo from "../assets/mooncake-sample-logo.jpeg"

const Navbar = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col justify-between h-full">

        <div>
          <button>LOGO</button>
        </div>

        <div>
          <button>Menu/Order</button>
        </div>

        <div className = "flex flex-col items-start">
          <button>About</button>
          <button>Contact</button>
          <button>Login</button>
        </div>

        <div>
          <button>CART</button>
        </div>

        <div>
          <button>Translate</button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
