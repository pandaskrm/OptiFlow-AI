"use client";

import { useState } from "react";

type ReceptionFormProps = {
  onSaved: () => void;
};

export default function ReceptionForm({ onSaved }: ReceptionFormProps) {
  const [form, setForm] = useState({
    number: "",
    supplier: "",
    carrier: "",
    dock: "",
    pallets: "",
    scheduledAt: "",
    status: "Planifiée",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.number ||
      !form.supplier ||
      !form.carrier ||
      !form.dock ||
      !form.pallets
    ) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    const response = await fetch("/api/receptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      alert("Erreur lors de l'enregistrement.");
      return;
    }

    setForm({
      number: "",
      supplier: "",
      carrier: "",
      dock: "",
      pallets: "",
      scheduledAt: "",
      status: "Planifiée",
    });

    onSaved();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">➕ Nouvelle réception</h2>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-semibold transition"
        >
          Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          value={form.number}
          onChange={(e) => handleChange("number", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          placeholder="Numéro de réception"
        />

        <input
          value={form.supplier}
          onChange={(e) => handleChange("supplier", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          placeholder="Fournisseur"
        />

        <input
          value={form.carrier}
          onChange={(e) => handleChange("carrier", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          placeholder="Transporteur"
        />

        <input
          value={form.dock}
          onChange={(e) => handleChange("dock", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          placeholder="Quai"
        />

        <input
          type="number"
          value={form.pallets}
          onChange={(e) => handleChange("pallets", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
          placeholder="Nombre de palettes"
        />

        <input
          type="time"
          value={form.scheduledAt}
          onChange={(e) => handleChange("scheduledAt", e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3"
        />
      </div>
    </div>
  );
}