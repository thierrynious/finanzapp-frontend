import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("AUSGABE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/categories");
      setCategories(res.data ?? []);
    } catch (err) {
      console.error("Fehler beim Laden der Kategorien:", err);
      setError("Kategorien konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  async function createCategory(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Bitte Kategoriename eingeben.");
      return;
    }

    try {
      await api.post("/categories", {
        name: name.trim(),
        type,
      });

      setName("");
      setType("AUSGABE");
      await loadCategories();
    } catch (err) {
      console.error("Fehler beim Erstellen der Kategorie:", err);
      alert(
        err.response?.data?.message ||
          "Kategorie konnte nicht erstellt werden.",
      );
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Kategorie wirklich löschen?")) return;

    try {
      await api.delete(`/categories/${id}`);
      await loadCategories();
    } catch (err) {
      console.error("Fehler beim Löschen der Kategorie:", err);
      alert(
        err.response?.data?.message ||
          "Kategorie konnte nicht gelöscht werden.",
      );
    }
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <div>
          <h1>Kategorien</h1>
          <p>Verwalte deine Einnahmen- und Ausgaben-Kategorien.</p>
        </div>
      </div>

      <form className="category-form" onSubmit={createCategory}>
        <input
          type="text"
          placeholder="Neue Kategorie, z. B. Lebensmittel"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="AUSGABE">Ausgabe</option>
          <option value="EINNAHME">Einnahme</option>
        </select>

        <button type="submit">Kategorie erstellen</button>
      </form>

      {loading && <p>Lade Kategorien...</p>}
      {error && <p className="category-error">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <p>Keine Kategorien vorhanden.</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <div className="categories-card">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Typ</th>
                <th>Aktionen</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <span
                      className={`category-badge ${
                        category.type === "EINNAHME"
                          ? "category-income"
                          : "category-expense"
                      }`}
                    >
                      {category.name}
                    </span>
                  </td>

                  <td>
                    {category.type === "EINNAHME" ? "Einnahme" : "Ausgabe"}
                  </td>

                  <td>
                    <button
                      className="category-delete-btn"
                      onClick={() => deleteCategory(category.id)}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
