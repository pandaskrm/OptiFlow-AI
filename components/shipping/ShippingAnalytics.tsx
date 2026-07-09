"use client";

import { useState } from "react";

const currentWeek = [212, 286, 301, 334, 298, 126];
const previousWeek = [198, 260, 280, 305, 270, 118];
const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function ShippingAnalytics() {
  const [mode, setMode] = useState<"week" | "month">("week");

  const total = currentWeek.reduce((sum, value) => sum + value, 0);
  const previousTotal = previousWeek.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...currentWeek, ...previousWeek);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Statistiques expédition</h2>
          <p className="text-sm text-slate-500">Comparaison avec la période précédente.</p>
        </div>

        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setMode("week")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === "week" ? "bg-slate-950 text-white" : "text-slate-500"
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setMode("month")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === "month" ? "bg-slate-950 text-white" : "text-slate-500"
            }`}
          >
            Mois
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Période actuelle</p>
          <p className="text-lg font-bold text-slate-950">{total} expéditions</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Période précédente</p>
          <p className="text-lg font-bold text-slate-950">{previousTotal} expéditions</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-600">Évolution</p>
          <p className="text-lg font-bold text-emerald-700">+{total - previousTotal}</p>
        </div>
      </div>

      <div className="flex h-64 items-end gap-4 rounded-2xl bg-slate-50 p-5">
        {days.map((day, index) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-40 w-full items-end justify-center gap-2">
              <div className="flex h-full w-1/2 items-end rounded-xl bg-slate-100">
                <div
                  className="w-full rounded-xl bg-slate-300"
                  style={{ height: `${(previousWeek[index] / max) * 100}%` }}
                />
              </div>
              <div className="flex h-full w-1/2 items-end rounded-xl bg-slate-100">
                <div
                  className="w-full rounded-xl bg-cyan-500"
                  style={{ height: `${(currentWeek[index] / max) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm font-bold text-slate-950">{day}</p>
            <p className="text-xs font-bold text-cyan-700">{currentWeek[index]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}