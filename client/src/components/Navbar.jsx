import React from "react";

const Navbar = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col justify-between h-full w-24 bg-orange-100 items-center">

        <div>
          <button>
            <img className = "h-20" src="/mooncake-sample-logo.jpeg" alt="Mooncake Logo"/>
          </button>
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
          <button>
            <img className = "h-20" src="/cart-sample-logo.jpeg" alt="Cart Logo"/>
          </button>
        </div>

        <div>
          <button>Translate</button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
