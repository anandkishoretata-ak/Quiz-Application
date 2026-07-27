import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      user?.email === email &&
      user?.password === password
    ) {
      localStorage.setItem(
        "isLoggedIn",
        true
      );

      navigate("/dashboard");
    } else {
      alert(
        "Invalid Credentials"
      );
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
        />

        <button type="submit">
          Login
        </button>

        <p
          style={{
            marginTop: "15px",
          }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;