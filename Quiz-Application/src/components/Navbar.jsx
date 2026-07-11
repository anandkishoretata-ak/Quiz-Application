import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    logout();

    localStorage.removeItem(
      "isLoggedIn"
    );

    window.location.href =
      "/login";
  };

  return (
    <nav className="navbar">
      <h2>Quiz Master</h2>

      <div>
        <Link to="/">
          Home
        </Link>

        <span>
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
