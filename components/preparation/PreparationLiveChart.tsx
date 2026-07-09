"use client";

import { useEffect, useState } from "react";

const initialData = [
  { hour: "08h", orders: 34 },
  { hour: "09h", orders: 58 },
  { hour: "10h", orders: 76 },
  { hour: "11h", orders: 91 },
  { hour: "12h", orders: 64 },
];

export default function PreparationLiveChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((current) =>
        current.map((item) => ({
          ...item,
          orders: Math.max(20, item.orders + Math.floor(Math.random() * 15 - 5)),
        }))
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const max = Math.max(...data.map((item) => item.orders));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Activité live</h2>
      <p className="text-sm text-slate-500">Commandes préparées par heure.</p>

      <div className="mt-6 flex h-48 items-end gap-4">
        {data.map((item) => (
          <div key={item.hour} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-40 w-full items-end rounded-xl bg-slate-100">
              <div
                className="w-full rounded-xl bg-cyan-500 transition-all duration-700"
                style={{ height: `${(item.orders / max) * 100}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-slate-500">{item.hour}</p>
            <p className="text-sm font-bold text-slate-950">{item.orders}</p>
          </div>
        ))}
      </div>
    </section>
  );
}