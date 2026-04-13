import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "./EditTransactionModal.css";

export default function EditTransactionModal({
  transaction,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    income: false,
    note: "",
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title || "",
        amount: Math.abs(transaction.amount || 0),
        date: transaction.date || "",
        income: transaction.income ?? false,
        note: transaction.note || "",
      });
    }
  }, [transaction]);

  async function handleSave() {
    await api.put(`/transactions/${transaction.id}`, {
      ...form,
      amount: Math.abs(Number(form.amount)),
    });

    onSaved();
    onClose();
  }

  if (!transaction) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Transaktion bearbeiten</h2>

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          value={String(form.income)}
          onChange={(e) =>
            setForm({ ...form, income: e.target.value === "true" })
          }
        >
          <option value="true">Einnahme</option>
          <option value="false">Ausgabe</option>
        </select>

        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Notiz"
        />

        <div className="modal-actions">
          <button onClick={onClose}>Abbrechen</button>
          <button onClick={handleSave}>Speichern</button>
        </div>
      </div>
    </div>
  );
}
