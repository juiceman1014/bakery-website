import React from "react";

const Navbar = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className>LOGO</div>

        <div>
          <button>Menu/Order</button>
        </div>

        <div className = "flex flex-col items-start">
          <button>About</button>
          <button>Contact</button>
          <button>Login</button>
        </div>

        <div>CART</div>

        <div>
          <button>Translate</button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
