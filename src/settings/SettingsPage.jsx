import React, { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "";

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "EUR",
  );

  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "DE",
  );

  function saveSettings(e) {
    e.preventDefault();

    localStorage.setItem("currency", currency);
    localStorage.setItem("language", language);

    alert("Einstellungen wurden gespeichert.");
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Einstellungen</h1>
        <p>Verwalte deine Konto- und App-Einstellungen.</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h2>Profil</h2>

          <div className="settings-info-row">
            <span>Benutzername</span>
            <strong>{username}</strong>
          </div>

          <div className="settings-info-row">
            <span>E-Mail</span>
            <strong>{email || "Keine E-Mail gespeichert"}</strong>
          </div>
        </div>

        <form className="settings-card" onSubmit={saveSettings}>
          <h2>App-Einstellungen</h2>

          <label>
            Standardwährung
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">US-Dollar ($)</option>
              <option value="GBP">Britisches Pfund (£)</option>
              <option value="XAF">CFA-Franc (FCFA)</option>
            </select>
          </label>

          <label>
            Sprache
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="DE">Deutsch</option>
              <option value="EN">Englisch</option>
              <option value="FR">Französisch</option>
            </select>
          </label>

          <button type="submit">Einstellungen speichern</button>
        </form>

        <div className="settings-card danger-card">
          <h2>Konto</h2>
          <p>
            Weitere Konto-Funktionen wie Passwort ändern oder Konto löschen
            können später ergänzt werden.
          </p>

          <button type="button" disabled>
            Passwort ändern
          </button>
        </div>
      </div>
    </div>
  );
}
