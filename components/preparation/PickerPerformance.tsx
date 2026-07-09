"use client";

import { useEffect, useState } from "react";

const initialPickers = [
  { name: "Lucas", orders: 74, rate: 118, status: "En préparation" },
  { name: "Emma", orders: 68, rate: 112, status: "Contrôle" },
  { name: "Sarah", orders: 61, rate: 106, status: "En préparation" },
  { name: "Mehdi", orders: 55, rate: 99, status: "Disponible" },
];

export default function PickerPerformance() {
  const [pickers, setPickers] = useState(initialPickers);

  useEffect(() => {
    const interval = setInterval(() => {
      setPickers((current) =>
        current
          .map((picker) => ({
            ...picker,
            orders: Math.max(30, picker.orders + Math.floor(Math.random() * 7 - 2)),
            rate: Math.max(85, picker.rate + Math.floor(Math.random() * 5 - 2)),
          }))
          .sort((a, b) => b.rate - a.rate)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Performance préparateurs</h2>
      <p className="text-sm text-slate-500">Classement opérationnel en direct.</p>

      <div className="mt-5 space-y-3">
        {pickers.map((picker, index) => (
          <div
            key={picker.name}
            className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
          >
            <div>
              <p className="font-bold text-slate-950">
                #{index + 1} {picker.name}
              </p>
              <p className="text-sm text-slate-500">{picker.status}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-slate-950">{picker.rate}%</p>
              <p className="text-xs text-slate-500">{picker.orders} commandes</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}