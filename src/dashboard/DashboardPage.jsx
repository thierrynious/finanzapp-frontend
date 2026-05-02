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
    categoryStats: {},
    latestTransactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

  const categoryData = Object.entries(dashboard.categoryStats || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/transactions/dashboard");

      setDashboard({
        balance: res.data?.balance ?? 0,
        totalIncome: res.data?.totalIncome ?? 0,
        totalExpenses: res.data?.totalExpenses ?? 0,
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
          </div>

          <div className="chart-card">
            <h3>Kategorie-Ausgaben</h3>

            {categoryData.length === 0 ? (
              <p>Keine Kategorie-Daten vorhanden.</p>
            ) : (
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label={({ name, value }) =>
                      `${name}: ${formatAmount(value)}`
                    }
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
