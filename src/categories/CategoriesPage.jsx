import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./CategoriesPage.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("AUSGABE");

  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("AUSGABE");

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

  function openEditModal(category) {
    setSelectedCategory(category);
    setEditName(category.name || "");
    setEditType(category.type || "AUSGABE");
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setSelectedCategory(null);
    setEditName("");
    setEditType("AUSGABE");
  }

  async function updateCategory(e) {
    e.preventDefault();

    if (!editName.trim()) {
      alert("Bitte Kategoriename eingeben.");
      return;
    }

    try {
      await api.put(`/categories/${selectedCategory.id}`, {
        name: editName.trim(),
        type: editType,
      });

      closeEditModal();
      await loadCategories();
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Kategorie:", err);
      alert(
        err.response?.data?.message ||
          "Kategorie konnte nicht aktualisiert werden.",
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
  function getCategoryClass(categoryName, categoryType) {
    if (categoryType === "EINNAHME") {
      return "category-income";
    }

    const normalizedName = (categoryName || "").toLowerCase();

    if (normalizedName.includes("lebensmittel")) return "category-food";
    if (normalizedName.includes("bargeld")) return "category-cash";
    if (normalizedName.includes("finanzen")) return "category-finance";
    if (normalizedName.includes("versicherung")) return "category-insurance";
    if (
      normalizedName.includes("telefon") ||
      normalizedName.includes("internet")
    )
      return "category-phone";
    if (normalizedName.includes("transfers")) return "category-transfer";
    if (
      normalizedName.includes("abos") ||
      normalizedName.includes("unterhaltung")
    )
      return "category-entertainment";
    if (normalizedName.includes("alltag")) return "category-everyday";
    if (normalizedName.includes("miete")) return "category-rent";
    if (normalizedName.includes("shopping")) return "category-shopping";

    return "category-expense";
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
                      className={`category-badge ${getCategoryClass(category.name, category.type)}`}
                    >
                      {category.name}
                    </span>
                  </td>

                  <td>
                    {category.type === "EINNAHME" ? "Einnahme" : "Ausgabe"}
                  </td>

                  <td>
                    <div className="category-actions">
                      <button
                        className="category-edit-btn"
                        onClick={() => openEditModal(category)}
                      >
                        Bearbeiten
                      </button>

                      <button
                        className="category-delete-btn"
                        onClick={() => deleteCategory(category.id)}
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editOpen && selectedCategory && (
        <div className="category-modal-overlay" onClick={closeEditModal}>
          <form
            className="category-modal"
            onSubmit={updateCategory}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Kategorie bearbeiten</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Kategoriename"
            />

            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
            >
              <option value="AUSGABE">Ausgabe</option>
              <option value="EINNAHME">Einnahme</option>
            </select>

            <div className="category-modal-actions">
              <button type="button" onClick={closeEditModal}>
                Abbrechen
              </button>
              <button type="submit">Speichern</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
