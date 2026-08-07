"use client";

import { useEffect, useMemo, useState } from "react";

type Picker = {
  name: string;
  bp: number;
  parcels: number;
  lines: number;
  quantity: number;
  performance: number;
  status: string;
};

const initialPickers: Picker[] = [
  { name: "Préparateur A", bp: 6, parcels: 24, lines: 633, quantity: 5179, performance: 118, status: "En préparation" },
  { name: "Préparateur B", bp: 16, parcels: 33, lines: 542, quantity: 3700, performance: 110, status: "En préparation" },
  { name: "Préparateur C", bp: 12, parcels: 33, lines: 498, quantity: 6891, performance: 105, status: "Contrôle" },
  { name: "Préparateur D", bp: 5, parcels: 35, lines: 479, quantity: 6883, performance: 101, status: "En préparation" },
  { name: "Préparateur E", bp: 12, parcels: 19, lines: 464, quantity: 2451, performance: 98, status: "Disponible" },
  { name: "Préparateur F", bp: 18, parcels: 21, lines: 455, quantity: 1987, performance: 96, status: "En préparation" },
];

export default function PickerPerformance() {
  const [pickers, setPickers] = useState(initialPickers);

  useEffect(() => {
    const interval = setInterval(() => {
      setPickers((current) =>
        current.map((picker) => ({
          ...picker,
          lines:
            picker.status === "Disponible"
              ? picker.lines
              : picker.lines + Math.floor(Math.random() * 4),
          quantity:
            picker.status === "Disponible"
              ? picker.quantity
              : picker.quantity + Math.floor(Math.random() * 18),
          performance: Math.max(
            88,
            Math.min(
              125,
              picker.performance + Math.floor(Math.random() * 3) - 1
            )
          ),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const ranked = useMemo(
    () => [...pickers].sort((a, b) => b.performance - a.performance),
    [pickers]
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-600">
            Préparation Intelligence
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Performance préparateurs
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Classement dynamique basé sur plusieurs indicateurs de préparation.
          </p>
        </div>

        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
          LIVE
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {ranked.map((picker, index) => (
          <div
            key={picker.name}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-950">
                  #{index + 1} {picker.name}
                </p>

                <p className="text-xs font-medium text-slate-600">
                  {picker.status}
                </p>
              </div>

              <p
                className={`text-2xl font-black ${
                  picker.performance >= 100
                    ? "text-emerald-600"
                    : "text-orange-500"
                }`}
              >
                {picker.performance}%
              </p>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <Metric label="BP" value={picker.bp} />
              <Metric label="Colis" value={picker.parcels} />
              <Metric label="Lignes" value={picker.lines} />
              <Metric label="Qté" value={picker.quantity} />
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-700"
                style={{ width: `${Math.min(100, picker.performance)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
        <p className="text-sm font-bold text-cyan-950">
          Analyse Libot
        </p>

        <p className="mt-1 text-sm text-cyan-900">
          La performance combine les BP, colis, lignes et quantités afin
          d'éviter de comparer les préparateurs uniquement sur le nombre
          de commandes terminées.
        </p>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="font-bold text-slate-950">
        {value.toLocaleString("fr-FR")}
      </p>
    </div>
  );
}