"use client";

import { useState } from "react";

type ReceptionFormProps = {
  onSaved: () => void;
};

const STORAGE_KEY = "optiflow_receptions";

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
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.number || !form.supplier || !form.carrier || !form.dock || !form.pallets) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    const newReception = {
      id: Date.now(),
      ...form,
      pallets: Number(form.pallets),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newReception, ...existing]));

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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">➕ Nouvelle réception</h2>

        <button
          onClick={handleSubmit}
          className="rounded-xl bg-blue-600 px-5 py-2 font-semibold transition hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <input value={form.number} onChange={(e) => handleChange("number", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Numéro de réception" />
        <input value={form.supplier} onChange={(e) => handleChange("supplier", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Fournisseur" />
        <input value={form.carrier} onChange={(e) => handleChange("carrier", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Transporteur" />

        <select value={form.dock} onChange={(e) => handleChange("dock", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3">
          <option value="">Sélectionner un quai</option>
          <option value="Quai 1">Quai 1</option>
          <option value="Quai 2">Quai 2</option>
          <option value="Quai 3">Quai 3</option>
          <option value="Quai 4">Quai 4</option>
          <option value="Quai 5">Quai 5</option>
          <option value="Quai 6">Quai 6</option>
        </select>

        <input type="number" value={form.pallets} onChange={(e) => handleChange("pallets", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3" placeholder="Nombre de palettes" />
        <input type="time" value={form.scheduledAt} onChange={(e) => handleChange("scheduledAt", e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3" />
      </div>
    </div>
  );
}