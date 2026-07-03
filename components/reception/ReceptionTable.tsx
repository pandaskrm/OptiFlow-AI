"use client";

import { useEffect, useState } from "react";
import ReceptionService from "../../services/reception.service";
import { Reception } from "../../types/reception";
import { getNextStatus, RECEPTION_STATUS } from "../../constants/receptionStatus";

type ReceptionTableProps = {
  refreshKey: number;
  onDeleted: () => void;
};

const statusStyle: Record<string, string> = {
  [RECEPTION_STATUS.PLANNED]: "bg-blue-500/20 text-blue-400",
  [RECEPTION_STATUS.AT_DOCK]: "bg-orange-500/20 text-orange-400",
  [RECEPTION_STATUS.UNLOADING]: "bg-yellow-500/20 text-yellow-400",
  [RECEPTION_STATUS.INSPECTION]: "bg-purple-500/20 text-purple-400",
  [RECEPTION_STATUS.COMPLETED]: "bg-green-500/20 text-green-400",
};

function getActionLabel(status: string) {
  if (status === RECEPTION_STATUS.PLANNED) return "▶️ Démarrer";
  if (status === RECEPTION_STATUS.AT_DOCK) return "📦 Déchargement";
  if (status === RECEPTION_STATUS.UNLOADING) return "🔍 Contrôle";
  if (status === RECEPTION_STATUS.INSPECTION) return "✅ Terminer";
  return "✅ Terminée";
}

export default function ReceptionTable({
  refreshKey,
  onDeleted,
}: ReceptionTableProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);

  useEffect(() => {
    loadReceptions();
  }, [refreshKey]);

  async function loadReceptions() {
    const data = await ReceptionService.getAll();
    setReceptions(data);
  }

  async function handleNextStatus(item: Reception) {
    const nextStatus = getNextStatus(item.status);

    if (nextStatus === item.status) return;

    const response = await ReceptionService.updateStatus(item.id, nextStatus);

    if (!response.ok) {
      alert("Erreur lors du changement de statut.");
      return;
    }

    loadReceptions();
    onDeleted();
  }

  async function deleteReception(id: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette réception ?"
    );

    if (!confirmDelete) return;

    const response = await ReceptionService.delete(id);

    if (response.ok) {
      loadReceptions();
      onDeleted();
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left">Réception</th>
            <th className="p-4 text-left">Fournisseur</th>
            <th className="p-4 text-left">Transporteur</th>
            <th className="p-4 text-left">Quai</th>
            <th className="p-4 text-left">Palettes</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-center">Workflow</th>
            <th className="p-4 text-center">Supprimer</th>
          </tr>
        </thead>

        <tbody>
          {receptions.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-6 text-center text-gray-400">
                Aucune réception enregistrée.
              </td>
            </tr>
          ) : (
            receptions.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-800 hover:bg-slate-800"
              >
                <td className="p-4 font-bold">{item.number}</td>
                <td className="p-4">{item.supplier}</td>
                <td className="p-4">{item.carrier}</td>
                <td className="p-4">{item.dock}</td>
                <td className="p-4">{item.pallets}</td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      statusStyle[item.status] || "bg-slate-500/20 text-slate-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => handleNextStatus(item)}
                    disabled={item.status === RECEPTION_STATUS.COMPLETED}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    {getActionLabel(item.status)}
                  </button>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteReception(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 transition hover:bg-red-700"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}