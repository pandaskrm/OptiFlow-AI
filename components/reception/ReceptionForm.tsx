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
    <div className="organia-electric-panel organia-electric-panel-v2 rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-6 shadow-[0_0_22px_rgba(0,140,255,0.15)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-white">
          ➕ Nouvelle réception
        </h2>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-xl border border-[#00e5ff]/60 bg-gradient-to-r from-[#006bff] via-[#008cff] to-[#00b8ff] px-5 py-2 font-black text-white shadow-[0_0_18px_rgba(0,140,255,0.30)] transition hover:shadow-[0_0_28px_rgba(0,229,255,0.40)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-number"
            className="text-xs font-semibold text-slate-500"
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
            className="w-full rounded-xl border border-[#008cff]/40 bg-[#020617]/85 p-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/80 focus:shadow-[0_0_16px_rgba(0,229,255,0.18)]"
            placeholder="Exemple : REC-2026-001"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-supplier"
            className="text-xs font-semibold text-slate-500"
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
            className="w-full rounded-xl border border-[#008cff]/40 bg-[#020617]/85 p-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/80 focus:shadow-[0_0_16px_rgba(0,229,255,0.18)]"
            placeholder="Nom du fournisseur"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-carrier"
            className="text-xs font-semibold text-slate-500"
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
            className="w-full rounded-xl border border-[#008cff]/40 bg-[#020617]/85 p-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/80 focus:shadow-[0_0_16px_rgba(0,229,255,0.18)]"
            placeholder="Nom du transporteur"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-dock"
            className="text-xs font-semibold text-slate-500"
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
            className="w-full rounded-xl border border-[#008cff]/40 bg-[#020617]/85 p-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/80 focus:shadow-[0_0_16px_rgba(0,229,255,0.18)]"
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
            className="text-xs font-semibold text-slate-500"
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
            className="w-full rounded-xl border border-[#008cff]/40 bg-[#020617]/85 p-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/80 focus:shadow-[0_0_16px_rgba(0,229,255,0.18)]"
            placeholder="Exemple : 24"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reception-scheduled-at"
            className="text-xs font-semibold text-slate-500"
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
            className="w-full rounded-xl border border-[#008cff]/40 bg-[#020617]/85 p-3 text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/80 focus:shadow-[0_0_16px_rgba(0,229,255,0.18)]"
          />
        </div>
      </div>
    </div>
  );
}