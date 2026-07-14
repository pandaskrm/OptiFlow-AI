"use client";

import { useState } from "react";
import { RECEPTION_STATUS } from "../../constants/receptionStatus";

type ReceptionFormProps = {
  onSaved: () => void;
};

const initialForm = {
  number: "",
  supplier: "",
  carrier: "",
  dock: "",
  pallets: "",
  scheduledAt: "",
};

export default function ReceptionForm({
  onSaved,
}: ReceptionFormProps) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (
      !form.number ||
      !form.supplier ||
      !form.carrier ||
      !form.dock ||
      !form.pallets ||
      !form.scheduledAt
    ) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/receptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          pallets: Number(form.pallets),
          status: RECEPTION_STATUS.PLANNED,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);

        throw new Error(
          error?.message ??
            "Impossible d'enregistrer la réception."
        );
      }

      setForm(initialForm);
      onSaved();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'enregistrement."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          ➕ Nouvelle réception
        </h2>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-xl bg-blue-600 px-5 py-2 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-number"
            className="text-sm text-slate-400"
          >
            Numéro de réception
          </label>

          <input
            id="reception-number"
            type="text"
            required
            value={form.number}
            onChange={(event) =>
              handleChange("number", event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            placeholder="Exemple : REC-2026-001"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-supplier"
            className="text-sm text-slate-400"
          >
            Fournisseur
          </label>

          <input
            id="reception-supplier"
            type="text"
            required
            value={form.supplier}
            onChange={(event) =>
              handleChange("supplier", event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            placeholder="Nom du fournisseur"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-carrier"
            className="text-sm text-slate-400"
          >
            Transporteur
          </label>

          <input
            id="reception-carrier"
            type="text"
            required
            value={form.carrier}
            onChange={(event) =>
              handleChange("carrier", event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            placeholder="Nom du transporteur"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-dock"
            className="text-sm text-slate-400"
          >
            Quai prévu
          </label>

          <select
            id="reception-dock"
            required
            value={form.dock}
            onChange={(event) =>
              handleChange("dock", event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Sélectionner un quai</option>
            <option value="Quai 1">Quai 1</option>
            <option value="Quai 2">Quai 2</option>
            <option value="Quai 3">Quai 3</option>
            <option value="Quai 4">Quai 4</option>
            <option value="Quai 5">Quai 5</option>
            <option value="Quai 6">Quai 6</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-pallets"
            className="text-sm text-slate-400"
          >
            Nombre de palettes
          </label>

          <input
            id="reception-pallets"
            type="number"
            min="1"
            required
            value={form.pallets}
            onChange={(event) =>
              handleChange("pallets", event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
            placeholder="Exemple : 24"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-scheduled-at"
            className="text-sm text-slate-400"
          >
            Date et heure prévues de la réception
          </label>

          <input
            id="reception-scheduled-at"
            type="datetime-local"
            required
            value={form.scheduledAt}
            onChange={(event) =>
              handleChange("scheduledAt", event.target.value)
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          />
        </div>
      </div>
    </div>
  );
}