"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useSimulation from "../../hooks/useSimulation";

export default function DashboardCharts() {
  const simulation = useSimulation();

  const data = useMemo(() => {
    const base = [
      { day: "Lun", receptions: 8 },
      { day: "Mar", receptions: 12 },
      { day: "Mer", receptions: 10 },
      { day: "Jeu", receptions: 18 },
      { day: "Ven", receptions: 14 },
    ];

    return [
      ...base,
      {
        day: "Live",
        receptions: simulation.activeReceptions,
      },
    ];
  }, [simulation]);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 h-[330px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            📈 Activité des réceptions
          </h2>

          <p className="text-sm text-slate-400">
            Évolution en temps réel
          </p>
        </div>

        <div className="rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-300 font-semibold">
          LIVE
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="colorReception"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#273449"
          />

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
            }}
          />

          <Area
            type="monotone"
            dataKey="receptions"
            stroke="#38bdf8"
            strokeWidth={3}
            fill="url(#colorReception)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}