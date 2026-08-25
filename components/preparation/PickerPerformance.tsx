"use client";

import { useMemo } from "react";
import useSimulationV2 from "../../hooks/useSimulationV2";

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
  const simulation = useSimulationV2();
  const tick = simulation.state.tick;

  const ranked = useMemo(() => {
    return initialPickers
      .map((picker, index) => {
        const active = picker.status !== "Disponible";

        return {
          ...picker,
          lines: picker.lines + (active ? tick * (index % 3 + 1) : 0),
          quantity: picker.quantity + (active ? tick * (index + 3) : 0),
          performance: Math.max(
            88,
            Math.min(
              125,
              picker.performance + ((tick + index) % 3) - 1
            )
          ),
        };
      })
      .sort((a, b) => b.performance - a.performance);
  }, [tick]);

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 rounded-3xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00e5ff]">
            Préparation Intelligence
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Performance préparateurs
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Classement dynamique basé sur plusieurs indicateurs de préparation.
          </p>
        </div>

        <span className="rounded-full border border-[#006bff]/30 bg-[#071426] px-3 py-1 text-xs font-bold text-white">
          LIVE
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {ranked.map((picker, index) => (
          <div
            key={picker.name}
            className="rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white">
                  #{index + 1} {picker.name}
                </p>

                <p className="text-xs font-medium text-slate-400">
                  {picker.status}
                </p>
              </div>

              <p
                className={`text-2xl font-black ${
                  picker.performance >= 100
                    ? "text-emerald-300"
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

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#10233b]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#006bff] via-[#008cff] to-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.55)] transition-all duration-700"
                style={{ width: `${Math.min(100, picker.performance)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[#00e5ff]/30 bg-gradient-to-r from-[#006bff]/12 to-[#00e5ff]/6 p-4 shadow-[0_0_20px_rgba(0,140,255,0.10)]">
        <p className="text-sm font-black text-[#00e5ff]">
          Analyse Libot
        </p>

        <p className="mt-1 text-sm text-slate-300">
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
      <p className="font-bold text-white">
        {value.toLocaleString("fr-FR")}
      </p>
    </div>
  );
}
