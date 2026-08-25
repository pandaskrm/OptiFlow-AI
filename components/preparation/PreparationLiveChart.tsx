"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";

const baseData = [
  { hour: "08h", orders: 34 },
  { hour: "09h", orders: 58 },
  { hour: "10h", orders: 76 },
  { hour: "11h", orders: 91 },
  { hour: "12h", orders: 64 },
];

export default function PreparationLiveChart() {
  const simulation = useSimulationV2();
  const tick = simulation.state.tick;

  const data = baseData.map((item, index) => ({
    ...item,
    orders: Math.max(
      20,
      item.orders + ((tick * (index + 2)) % 17) - 5
    ),
  }));

  const max = Math.max(...data.map((item) => item.orders));

  return (
    <section className="rounded-3xl border border-[#006bff]/30 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-6 shadow-sm">
      <h2 className="text-xl font-bold text-white">Activité live</h2>
      <p className="text-sm font-medium text-slate-300">
        Commandes préparées par heure.
      </p>

      <div className="mt-6 flex h-48 items-end gap-4">
        {data.map((item) => (
          <div
            key={item.hour}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-40 w-full items-end rounded-xl bg-[#0b1d33]">
              <div
                className="w-full rounded-xl bg-[#00e5ff]/80 transition-all duration-700"
                style={{ height: `${(item.orders / max) * 100}%` }}
              />
            </div>

            <p className="text-xs font-semibold text-slate-400">
              {item.hour}
            </p>

            <p className="text-sm font-bold text-white">
              {item.orders}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
