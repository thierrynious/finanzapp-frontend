import React, { useState, useRef } from "react";
import api from "../api/axios";
import "./BankStatementUpload.css";

export default function BankStatementUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const dropRef = useRef(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setStatus("");
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setStatus("");
    dropRef.current?.classList.remove("dragover");
  }

  function handleDragOver(e) {
    e.preventDefault();
    dropRef.current?.classList.add("dragover");
  }

  function handleDragLeave() {
    dropRef.current?.classList.remove("dragover");
  }

  async function handleUpload() {
    if (!file) {
      setStatus("❗ Bitte eine Datei auswählen!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload/bankstatement", formData);

      alert(`Import abgeschlossen:
Gesamt: ${res.data.totalParsed}
Importiert: ${res.data.imported}
Duplikate: ${res.data.duplicates}`);

      setStatus("✅ Upload erfolgreich!");
      setFile(null);
    } catch (err) {
      console.error("❌ Upload Fehler:", err);
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);

      setStatus(err.response?.data?.message || "❌ Fehler beim Upload");
    }
  }

  return (
    <div className="upload-container">
      <h1 className="title">FinanzApp</h1>

      <div className="upload-card">
        <h2>Kontoauszug Upload</h2>

        <div
          className="dropzone"
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {file ? <p>📄 {file.name}</p> : <p>Drag & drop a file here</p>}
        </div>

        <input
          type="file"
          className="file-input"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
        />

        <button className="upload-btn" onClick={handleUpload}>
          Datei hochladen
        </button>

        {status && <p className="upload-status">{status}</p>}
      </div>
    </div>
  );
}
