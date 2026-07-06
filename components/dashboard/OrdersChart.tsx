"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Lun", commandes: 486 },
  { day: "Mar", commandes: 520 },
  { day: "Mer", commandes: 498 },
  { day: "Jeu", commandes: 610 },
  { day: "Ven", commandes: 575 },
  { day: "Sam", commandes: 320 },
  { day: "Dim", commandes: 210 },
];

export default function OrdersChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          📈 Évolution des commandes
        </h2>
        <p className="text-sm text-slate-400">
          Volume traité sur les 7 derniers jours
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#94a3b8" />
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
    </div>
  );
}