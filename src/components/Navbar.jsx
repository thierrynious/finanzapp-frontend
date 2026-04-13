import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/transactions" className="navbar-item">
          Transaktionen
        </NavLink>

        <NavLink to="/categories" className="navbar-item">
          Kategorien
        </NavLink>

        <NavLink to="/upload" className="navbar-item">
          Kontoauszug Upload
        </NavLink>

        <NavLink to="/settings" className="navbar-item">
          Einstellungen
        </NavLink>
      </div>

      <div className="navbar-right">
        <NavLink to="/dashboard" className="navbar-title">
          Dashboard
        </NavLink>

        <div className="navbar-user-box">
          <span className="navbar-user-name">👤 {username || "User"}</span>
          <span className="navbar-user-email">{email || ""}</span>
        </div>

        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
