import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Check your credentials.",
      );
    }
  }

  return (
    <div className="login-page">
      <div className="login-root">
        <div className="login-card">
          <h1 className="login-title">FinanzApp</h1>

          <form onSubmit={handleLogin} className="login-form">
            <label className="login-label">
              Your email
              <input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="login-label">
              Password
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-primary">
              Login
            </button>
          </form>

          <p className="login-footer">
            Don’t have an account yet? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
