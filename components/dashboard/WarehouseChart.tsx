"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WarehouseChartProps = {
  hasData: boolean;
  simulationRunning: boolean;
  data: {
    day: string;
    commandes: number;
  }[];
};

export default function WarehouseChart({
  hasData,
  simulationRunning,
  data,
}: WarehouseChartProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          📈 Évolution des commandes
        </h2>

        <p className="text-sm text-slate-500">
          {simulationRunning
            ? "Volume simulé sur les 7 derniers jours"
            : "Données issues de votre ERP"}
        </p>
      </div>

      {hasData ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="day"
                stroke="#94a3b8"
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
              />

              <Line
                type="monotone"
                dataKey="commandes"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/30">
          <div className="text-center">
            <div className="text-5xl">📊</div>

            <h3 className="mt-4 text-xl font-bold text-white">
              Aucune donnée ERP disponible
            </h3>

            <p className="mt-2 text-slate-500">
              Connectez votre ERP ou activez le Mode Démo
              pour afficher les statistiques.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}