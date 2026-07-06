"use client";

import { useEffect, useState } from "react";
import ReceptionService from "../../services/reception.service";
import ReceptionTimeline from "../timeline/ReceptionTimeline";
import { Reception } from "../../types/reception";
import {
  getNextStatus,
  getStatusColor,
  RECEPTION_STATUS,
  STATUS_ORDER,
} from "../../constants/receptionStatus";

type ReceptionTableProps = {
  refreshKey: number;
  onDeleted: () => void;
};

function getActionLabel(status: string) {
  if (status === RECEPTION_STATUS.PLANNED) return "▶️ Démarrer";
  if (status === RECEPTION_STATUS.AT_DOCK) return "📦 Déchargement";
  if (status === RECEPTION_STATUS.UNLOADING) return "🔍 Contrôle";
  if (status === RECEPTION_STATUS.INSPECTION) return "✅ Terminer";
  return "✅ Terminée";
}

function getProgress(status: string) {
  const index = STATUS_ORDER.indexOf(status as any);
  if (index === -1) return 0;
  return Math.round(((index + 1) / STATUS_ORDER.length) * 100);
}

export default function ReceptionTable({
  refreshKey,
  onDeleted,
}: ReceptionTableProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [openedId, setOpenedId] = useState<number | null>(null);

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

    setLoadingId(item.id);
    const response = await ReceptionService.updateStatus(item.id, nextStatus);
    setLoadingId(null);

    if (!response.ok) {
      alert("Erreur lors du changement de statut.");
      return;
    }

    await loadReceptions();
    onDeleted();
  }

  async function deleteReception(id: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette réception ?"
    );

    if (!confirmDelete) return;

    const response = await ReceptionService.delete(id);

    if (response.ok) {
      await loadReceptions();
      onDeleted();
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white">
          📋 Pilotage des réceptions
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Suivi opérationnel des camions, statuts et quais.
        </p>
      </div>

      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left">Réception</th>
            <th className="p-4 text-left">Fournisseur</th>
            <th className="p-4 text-left">Transporteur</th>
            <th className="p-4 text-left">Quai</th>
            <th className="p-4 text-left">Palettes</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-left">Progression</th>
            <th className="p-4 text-center">Timeline</th>
            <th className="p-4 text-center">Action</th>
            <th className="p-4 text-center">Supprimer</th>
          </tr>
        </thead>

        <tbody>
          {receptions.length === 0 ? (
            <tr>
              <td colSpan={10} className="p-6 text-center text-slate-400">
                Aucune réception enregistrée.
              </td>
            </tr>
          ) : (
            receptions.map((item) => {
              const progress = getProgress(item.status);
              const isCompleted = item.status === RECEPTION_STATUS.COMPLETED;
              const isLoading = loadingId === item.id;
              const isOpened = openedId === item.id;

              return (
                <>
                  <tr
                    key={item.id}
                    className="border-t border-slate-800 hover:bg-slate-800/70"
                  >
                    <td className="p-4 font-bold text-white">{item.number}</td>
                    <td className="p-4 text-slate-300">{item.supplier}</td>
                    <td className="p-4 text-slate-300">{item.carrier}</td>
                    <td className="p-4 text-slate-300">{item.dock}</td>
                    <td className="p-4 text-slate-300">{item.pallets}</td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="w-32">
                        <div className="mb-1 text-xs text-slate-400">
                          {progress} %
                        </div>
                        <div className="h-2 rounded-full bg-slate-700">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() =>
                          setOpenedId(isOpened ? null : item.id)
                        }
                        className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold transition hover:bg-cyan-700"
                      >
                        {isOpened ? "Masquer" : "Voir"}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleNextStatus(item)}
                        disabled={isCompleted || isLoading}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                      >
                        {isLoading ? "⏳..." : getActionLabel(item.status)}
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

                  {isOpened && (
                    <tr className="border-t border-slate-800">
                      <td colSpan={10} className="bg-slate-950 p-6">
                        <ReceptionTimeline reception={item} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}