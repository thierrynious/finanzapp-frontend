import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./TransactionsPage.css";
import { formatAmount } from "../utils/format";
import EditTransactionModal from "./EditTransactionModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [income, setIncome] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    title: "",
    amount: "",
    date: "",
    income: true,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const pageSize = 20;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [page, search, income, categoryId]);

  async function loadCategories() {
    try {
      const res = await api.get("/categories");
      setCategories(res.data ?? []);
    } catch (err) {
      console.error("Fehler beim Laden der Kategorien:", err);
    }
  }

  async function loadTransactions() {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        size: pageSize,
      };

      if (search.trim() !== "") {
        params.search = search.trim();
      }

      if (income !== "") {
        params.income = income;
      }

      if (categoryId !== "") {
        params.categoryId = categoryId;
      }

      const res = await api.get("/transactions", { params });

      setTransactions(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch (err) {
      console.error("Fehler beim Laden der Transaktionen:", err);
      setError("Transaktionen konnten nicht geladen werden.");
      setTransactions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  async function createTransaction(force = false) {
    if (!newTx.title.trim() || !newTx.date || !newTx.amount) {
      alert("Bitte Titel, Datum und Betrag ausfüllen.");
      return;
    }

    const payload = {
      title: newTx.title.trim(),
      date: newTx.date,
      amount: Math.abs(Number(newTx.amount)),
      income: newTx.income,
    };

    try {
      await api.post("/transactions", payload, {
        params: { force },
      });

      setCreateOpen(false);
      setNewTx({
        title: "",
        amount: "",
        date: "",
        income: true,
      });

      setPage(0);
      await loadTransactions();
    } catch (err) {
      if (err.response?.status === 409) {
        const ok = window.confirm(
          "⚠️ Diese Transaktion sieht nach einem Duplikat aus.\n\n" +
            "Möchtest du sie trotzdem speichern?",
        );

        if (ok) {
          createTransaction(true);
        }
      } else {
        console.error(err);
        alert("❌ Fehler beim Speichern");
      }
    }
  }

  async function deleteTransaction(id) {
    if (!window.confirm("Transaktion löschen?")) return;

    try {
      await api.delete(`/transactions/${id}`);
      await loadTransactions();
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      alert("❌ Fehler beim Löschen");
    }
  }

  function openEditModal(tx) {
    setSelectedTransaction(tx);
    setEditOpen(true);
  }

  function resetFilters() {
    setSearch("");
    setIncome("");
    setCategoryId("");
    setPage(0);
  }

  function getCategoryClass(categoryName, incomeValue) {
    if (incomeValue) {
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
    ) {
      return "category-phone";
    }

    if (normalizedName.includes("transfers")) return "category-transfer";

    if (
      normalizedName.includes("abos") ||
      normalizedName.includes("unterhaltung")
    ) {
      return "category-entertainment";
    }

    if (normalizedName.includes("alltag")) return "category-everyday";
    if (normalizedName.includes("miete")) return "category-rent";
    if (normalizedName.includes("shopping")) return "category-shopping";

    return "category-expense";
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>Transaktionen</h1>
        <button
          className="new-transaction-btn"
          onClick={() => setCreateOpen(true)}
        >
          ➕ Neue Transaktion
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Titel suchen…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <select
          value={income}
          onChange={(e) => {
            setIncome(e.target.value);
            setPage(0);
          }}
        >
          <option value="">Alle Typen</option>
          <option value="true">Einnahmen</option>
          <option value="false">Ausgaben</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(0);
          }}
        >
          <option value="">Alle Kategorien</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button onClick={loadTransactions}>Filtern</button>
        <button className="reset-filter-btn" onClick={resetFilters}>
          Zurücksetzen
        </button>
      </div>

      {loading && <p>Lade Transaktionen...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && transactions.length === 0 && (
        <p>Keine Transaktionen gefunden.</p>
      )}

      {!loading && !error && transactions.length > 0 && (
        <>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Titel</th>
                <th>Kategorie</th>
                <th>Betrag</th>
                <th>Typ</th>
                <th>Aktionen</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.title}</td>

                  <td>
                    <span
                      className={`category-badge ${getCategoryClass(tx.category, tx.income)}`}
                    >
                      {tx.category || "Sonstiges"}
                    </span>
                  </td>

                  <td className={tx.income ? "income" : "expense"}>
                    {formatAmount(tx.amount)}
                  </td>

                  <td>{tx.income ? "Einnahme" : "Ausgabe"}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(tx)}
                        title="Bearbeiten"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTransaction(tx.id)}
                        title="Löschen"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              ◀ Zurück
            </button>

            <span>
              Seite {page + 1} / {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Weiter ▶
            </button>
          </div>
        </>
      )}

      {createOpen && (
        <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Neue Transaktion</h2>

            <input
              placeholder="Titel"
              value={newTx.title}
              onChange={(e) => setNewTx({ ...newTx, title: e.target.value })}
            />

            <input
              type="date"
              value={newTx.date}
              onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
            />

            <input
              type="number"
              step="0.01"
              value={newTx.amount}
              onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
            />

            <select
              value={String(newTx.income)}
              onChange={(e) =>
                setNewTx({ ...newTx, income: e.target.value === "true" })
              }
            >
              <option value="true">Einnahme</option>
              <option value="false">Ausgabe</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setCreateOpen(false)}>Abbrechen</button>
              <button onClick={() => createTransaction(false)}>Anlegen</button>
            </div>
          </div>
        </div>
      )}

      {editOpen && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          categories={categories}
          onClose={() => {
            setEditOpen(false);
            setSelectedTransaction(null);
          }}
          onSaved={async () => {
            await loadCategories();
            await loadTransactions();
          }}
        />
      )}
    </div>
  );
}
