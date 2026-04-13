// src/components/TopNav.jsx
import React from "react";
import "./TopNav.css";
import { Link, useLocation } from "react-router-dom";

export default function TopNav() {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <nav className="topnav">
      <div className="nav-left">
        <Link className={`nav-item ${isActive("/transactions")}`} to="/transactions">
          Transaktionen
        </Link>

        <Link className={`nav-item ${isActive("/categories")}`} to="/categories">
          Kategorien
        </Link>

        <Link className={`nav-item ${isActive("/upload")}`} to="/upload">
          Kontoauszug Upload
        </Link>

        <Link className={`nav-item ${isActive("/settings")}`} to="/settings">
          Einstellungen
        </Link>
      </div>

      <div className="nav-right">
        <span className="nav-title">Dashboard</span>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
