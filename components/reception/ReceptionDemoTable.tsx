"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import {
  createSimulationReceptionDetailsV2,
  SimulationReceptionDetailV2,
} from "../../lib/simulation/simulationReceptionDetailsV2";

function getStatusLabel(
  status: SimulationReceptionDetailV2["status"],
) {
  switch (status) {
    case "planned":
      return "📝 Planifiée";
    case "arriving":
      return "🚚 Camion annoncé";
    case "dock":
      return "🚛 À quai";
    case "unloading":
      return "📦 Déchargement";
    case "quality":
      return "🔍 Contrôle";
    case "completed":
      return "✅ Terminée";
  }
}

export default function ReceptionDemoTable() {
  const simulation = useSimulationV2();

  const rows = createSimulationReceptionDetailsV2(
    simulation.scenario,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white">
          📋 Pilotage des réceptions (Démo)
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Les réceptions sont synchronisées avec le scénario
          Simulation V2 actif.
        </p>
      </div>

      <div className="overflow-x-auto">
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
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-slate-800 transition hover:bg-slate-800/60"
              >
                <td className="p-4 font-bold text-white">
                  {row.receptionNumber}
                </td>

                <td className="p-4 text-slate-300">
                  {row.supplier}
                </td>

                <td className="p-4 text-slate-300">
                  {row.carrier}
                </td>

                <td className="p-4 text-slate-300">
                  Quai {row.dock}
                </td>

                <td className="p-4 text-slate-300">
                  {row.pallets}
                </td>

                <td className="p-4 text-slate-300">
                  {getStatusLabel(row.status)}
                </td>

                <td className="p-4">
                  <div className="w-40">
                    <div className="mb-1 text-xs font-medium text-slate-600">
                      {row.progress} %
                    </div>

                    <div className="h-2 rounded-full bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-cyan-500 transition-all duration-700"
                        style={{
                          width: `${row.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
