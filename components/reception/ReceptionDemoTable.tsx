"use client";

import { useEffect, useState } from "react";

type DemoReception = {
  reception: string;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
  progress: number;
};

const suppliers = [
  "Nike",
  "Apple",
  "Adidas",
  "Samsung",
  "Sony",
  "L'Oréal",
  "Bosch",
];

const carriers = [
  "DHL",
  "Chronopost",
  "Geodis",
  "DB Schenker",
  "UPS",
];

const initialRows: DemoReception[] = [
  {
    reception: "RE240001",
    supplier: "Nike",
    carrier: "DHL",
    dock: "Quai 1",
    pallets: 24,
    status: "🚛 À quai",
    progress: 20,
  },
  {
    reception: "RE240002",
    supplier: "Apple",
    carrier: "Geodis",
    dock: "Quai 2",
    pallets: 18,
    status: "📦 Déchargement",
    progress: 45,
  },
  {
    reception: "RE240003",
    supplier: "Adidas",
    carrier: "Chronopost",
    dock: "Quai 3",
    pallets: 12,
    status: "🔍 Contrôle",
    progress: 75,
  },
];

export default function ReceptionDemoTable() {
  const [rows, setRows] = useState(initialRows);

  useEffect(() => {
    const interval = setInterval(() => {
      setRows((current) =>
        current.map((row, index) => {
          let progress = Math.min(
            100,
            row.progress + Math.floor(Math.random() * 18) + 5
          );

          let status = "📝 Planifiée";

          if (progress >= 15) status = "🚛 À quai";
          if (progress >= 35) status = "📦 Déchargement";
          if (progress >= 70) status = "🔍 Contrôle";
          if (progress >= 100) status = "✅ Terminée";

          if (progress >= 100) {
            progress = 0;

            return {
              reception: `RE24${Math.floor(
                1000 + Math.random() * 9000
              )}`,
              supplier:
                suppliers[Math.floor(Math.random() * suppliers.length)],
              carrier:
                carriers[Math.floor(Math.random() * carriers.length)],
              dock: `Quai ${index + 1}`,
              pallets: Math.floor(Math.random() * 25) + 5,
              status: "📝 Planifiée",
              progress,
            };
          }

          return {
            ...row,
            progress,
            status,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white">
          📋 Pilotage des réceptions (Démo)
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Simulation temps réel des réceptions.
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
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.reception}
              className="border-t border-slate-800 hover:bg-slate-800/60 transition"
            >
              <td className="p-4 font-bold text-white">{row.reception}</td>
              <td className="p-4 text-slate-300">{row.supplier}</td>
              <td className="p-4 text-slate-300">{row.carrier}</td>
              <td className="p-4 text-slate-300">{row.dock}</td>
              <td className="p-4 text-slate-300">{row.pallets}</td>
              <td className="p-4 text-slate-300">{row.status}</td>

              <td className="p-4">
                <div className="w-40">
                  <div className="mb-1 text-xs text-slate-400">
                    {row.progress} %
                  </div>

                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full rounded-full bg-cyan-500 transition-all duration-700"
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
  );
}