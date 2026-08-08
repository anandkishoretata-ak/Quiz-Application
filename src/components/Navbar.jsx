import { Link } from "react-router-dom";
import { useContext } from "react";

import { logout } from "../utils/auth";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { theme, setTheme } =
    useContext(ThemeContext);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    logout();

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        Quiz Master
      </h2>

      <div className="nav-links">
        <Link to="/">
          Home
        </Link>

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/leaderboard">
          Leaderboard
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        <span className="username">
          👤 {user?.name || "Student"}
        </span>

        <button
          className="theme-btn"
          onClick={() =>
            setTheme(
              theme === "dark"
                ? "light"
                : "dark"
            )
          }
        >
          {theme === "dark"
            ? "☀️"
            : "🌙"}
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;