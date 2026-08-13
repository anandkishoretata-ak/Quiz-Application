import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { logout } from "../utils/auth";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();

  const { theme, setTheme } =
    useContext(ThemeContext);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    logout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("score");
    localStorage.removeItem("total");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}

      <div className="nav-logo">
        <h2>
          🧠 Quiz Master
        </h2>
      </div>

      {/* Navigation Links */}

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

        {/* Username */}

        <span className="username">
          👤 {user?.name || "Student"}
        </span>

        {/* Theme Toggle */}

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

        {/* Logout */}

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