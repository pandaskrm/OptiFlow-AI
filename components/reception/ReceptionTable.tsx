"use client";

import { useEffect, useState } from "react";

type ReceptionTableProps = {
  refreshKey: number;
  onDeleted: () => void;
};

type Reception = {
  id: number;
  number: string;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
  scheduledAt: string;
};

export default function ReceptionTable({
  refreshKey,
  onDeleted,
}: ReceptionTableProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);

  useEffect(() => {
    loadReceptions();
  }, [refreshKey]);

  async function loadReceptions() {
    const response = await fetch("/api/receptions");
    const data = await response.json();
    setReceptions(data);
  }

  async function deleteReception(id: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette réception ?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/receptions/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadReceptions();
      onDeleted();
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left">Réception</th>
            <th className="p-4 text-left">Fournisseur</th>
            <th className="p-4 text-left">Transporteur</th>
            <th className="p-4 text-left">Quai</th>
            <th className="p-4 text-left">Palettes</th>
            <th className="p-4 text-left">Statut</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {receptions.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-gray-400"
              >
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
                  <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    {item.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteReception(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
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