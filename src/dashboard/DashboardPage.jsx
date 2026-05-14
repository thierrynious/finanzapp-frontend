import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { formatAmount } from "../utils/format";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    balance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    transactionCount: 0,
    biggestExpense: 0,
    biggestIncome: 0,
    categoryStats: {},
    latestTransactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#06b6d4",
    "#84cc16",
  ];

  const [filter, setFilter] = useState("ALL");

  const categoryData = Object.entries(dashboard.categoryStats || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalCategoryExpenses = categoryData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();
  }, [filter]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const now = new Date();
      const params = {};

      if (filter === "CURRENT_MONTH") {
        params.month = now.getMonth() + 1;
        params.year = now.getFullYear();
      }

      if (filter === "LAST_MONTH") {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        params.month = lastMonth.getMonth() + 1;
        params.year = lastMonth.getFullYear();
      }

      if (filter === "CURRENT_YEAR") {
        params.year = now.getFullYear();
      }

      const res = await api.get("/transactions/dashboard", { params });

      setDashboard({
        balance: res.data?.balance ?? 0,
        totalIncome: res.data?.totalIncome ?? 0,
        totalExpenses: res.data?.totalExpenses ?? 0,
        transactionCount: res.data?.transactionCount ?? 0,
        biggestExpense: res.data?.biggestExpense ?? 0,
        biggestIncome: res.data?.biggestIncome ?? 0,
        categoryStats: res.data?.categoryStats ?? {},
        latestTransactions: res.data?.latestTransactions ?? [],
      });
    } catch (err) {
      console.error("Fehler beim Laden des Dashboards:", err);
      setError(
        err.response?.data?.message || "Dashboard konnte nicht geladen werden.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Hier siehst du deine wichtigsten Finanzdaten auf einen Blick.</p>
        </div>

        <select
          className="dashboard-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Alle Daten</option>
          <option value="CURRENT_MONTH">Dieser Monat</option>
          <option value="LAST_MONTH">Letzter Monat</option>
          <option value="CURRENT_YEAR">Dieses Jahr</option>
        </select>
      </div>

      {loading && <p>Lade Dashboard...</p>}
      {error && <p className="dashboard-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card balance-card">
              <h3>Saldo</h3>
              <p>{formatAmount(dashboard.balance)}</p>
            </div>

            <div className="dashboard-card income-card">
              <h3>Gesamteinnahmen</h3>
              <p>{formatAmount(dashboard.totalIncome)}</p>
            </div>

            <div className="dashboard-card expense-card">
              <h3>Gesamtausgaben</h3>
              <p>{formatAmount(dashboard.totalExpenses)}</p>
            </div>
            <div className="quick-stats">
              <div className="quick-stat-card">
                <h4>Transaktionen</h4>
                <p>{dashboard.transactionCount}</p>
              </div>

              <div className="quick-stat-card">
                <h4>Größte Einnahme</h4>
                <p className="income-text">
                  {formatAmount(dashboard.biggestIncome)}
                </p>
              </div>

              <div className="quick-stat-card">
                <h4>Größte Ausgabe</h4>
                <p className="expense-text">
                  {formatAmount(dashboard.biggestExpense)}
                </p>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Kategorie-Ausgaben</h3>

            {categoryData.length === 0 ? (
              <p>Keine Kategorie-Daten vorhanden.</p>
            ) : (
              <div className="category-dashboard-grid">
                <div className="category-chart-wrapper">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={115}
                        paddingAngle={2}
                        label={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip formatter={(value) => formatAmount(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="category-summary-list">
                  <h4>Top-Kategorien</h4>

                  {categoryData.map((category, index) => {
                    const percent =
                      totalCategoryExpenses > 0
                        ? (category.value / totalCategoryExpenses) * 100
                        : 0;

                    return (
                      <div
                        className="category-summary-item"
                        key={category.name}
                      >
                        <div className="category-summary-left">
                          <span
                            className="category-color-dot"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />

                          <div>
                            <strong>{category.name}</strong>
                            <span>{percent.toFixed(1)} % der Ausgaben</span>
                          </div>
                        </div>

                        <strong className="category-summary-amount">
                          {formatAmount(category.value)}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Letzte Transaktionen</h2>
            </div>

            {dashboard.latestTransactions.length === 0 ? (
              <p>Keine Transaktionen vorhanden.</p>
            ) : (
              <table className="recent-transactions-table">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Titel</th>
                    <th>Betrag</th>
                    <th>Typ</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.latestTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td>{tx.title}</td>
                      <td>
                        <span
                          className={tx.income ? "income-text" : "expense-text"}
                        >
                          {formatAmount(tx.amount)}
                        </span>
                      </td>
                      <td>{tx.income ? "Einnahme" : "Ausgabe"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
