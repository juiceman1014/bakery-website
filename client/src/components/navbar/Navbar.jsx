import React from "react";

const Navbar = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className>LOGO</div>

        <div>Menu/Order</div>

        <div>
          <p>About</p>
          <p>Contact</p>
          <p>Login</p>
        </div>

        <div>CART</div>

        <div>Translate</div>
      </div>
    </div>
  );
};

export default Navbar;
