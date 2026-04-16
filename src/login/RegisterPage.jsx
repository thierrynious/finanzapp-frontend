import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.username.trim() || !form.password.trim()) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }

    if (form.password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users", {
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-root">
        <div className="register-card">
          <h1 className="register-title">FinanzApp</h1>
          <p className="register-subtitle">Create your account</p>

          <form onSubmit={handleRegister} className="register-form">
            <label className="register-label">
              Your email
              <input
                type="email"
                className="register-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>

            <label className="register-label">
              Username
              <input
                type="text"
                className="register-input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>

            <label className="register-label">
              Password
              <input
                type="password"
                className="register-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>

            <label className="register-label">
              Confirm password
              <input
                type="password"
                className="register-input"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
              />
            </label>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="register-primary"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
