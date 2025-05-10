import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <nav>
        <Link to="/" className="mr-[2rem]">
          {" "}
          Home Page
        </Link>

        <Link to="/details">Create Post</Link>
      </nav>
    </div>
  );
};

export default Nav;
