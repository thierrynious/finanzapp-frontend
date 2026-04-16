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

  const [saving, setSaving] = useState(false);

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
    if (!form.title.trim() || !form.date || !form.amount) {
      alert("Bitte Titel, Datum und Betrag ausfüllen.");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/transactions/${transaction.id}`, {
        ...form,
        title: form.title.trim(),
        amount: Math.abs(Number(form.amount)),
      });

      await onSaved();
      onClose();
    } catch (err) {
      console.error("Fehler beim Aktualisieren:", err);
      alert(
        err.response?.data?.message ||
          "❌ Fehler beim Aktualisieren der Transaktion",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!transaction) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Transaktion bearbeiten</h2>

        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          disabled={saving}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          disabled={saving}
        />

        <input
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          disabled={saving}
        />

        <select
          value={String(form.income)}
          onChange={(e) =>
            setForm({ ...form, income: e.target.value === "true" })
          }
          disabled={saving}
        >
          <option value="true">Einnahme</option>
          <option value="false">Ausgabe</option>
        </select>

        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Notiz"
          disabled={saving}
        />

        <div className="modal-actions">
          <button onClick={onClose} disabled={saving}>
            Abbrechen
          </button>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Speichert..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
