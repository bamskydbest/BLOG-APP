// import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <nav>
        {/* <Link to="/" className="btn">
        Home Page
      </Link>
      <Link to="/about-us" className="btn">
        About Page
      </Link>
      <Link to="/contact-us" className="btn">
        Contact Page
      </Link>
      <Link to="/responsiveness" className="btn">
        Responsiveness Page
      </Link> */}

        <Link to="/" className="">
          {" "}
          Home Page
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
