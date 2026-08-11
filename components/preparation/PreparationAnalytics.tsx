"use client";

import { useState } from "react";

const currentWeek = [
  { day: "Lun", date: "06/07", orders: 345 },
  { day: "Mar", date: "07/07", orders: 450 },
  { day: "Mer", date: "08/07", orders: 410 },
  { day: "Jeu", date: "09/07", orders: 501 },
  { day: "Ven", date: "10/07", orders: 438 },
  { day: "Sam", date: "11/07", orders: 184 },
];

const previousWeek = [318, 421, 398, 462, 405, 172];

const currentMonth = [
  382, 410, 395, 460, 438, 184, 0,
  345, 450, 410, 501, 438, 184, 0,
  390, 421, 447, 476, 452, 201, 0,
  405, 468, 433, 489, 471, 220, 0,
  396, 412, 455,
];

const previousMonth = [
  350, 388, 372, 430, 415, 160, 0,
  326, 421, 389, 466, 412, 170, 0,
  365, 397, 420, 448, 431, 180, 0,
  382, 436, 410, 460, 445, 198, 0,
  370, 390, 420,
];

export default function PreparationAnalytics() {
  const [mode, setMode] = useState<"week" | "month">("week");

  const currentWeekTotal = currentWeek.reduce((sum, item) => sum + item.orders, 0);
  const previousWeekTotal = previousWeek.reduce((sum, value) => sum + value, 0);
  const currentMonthTotal = currentMonth.reduce((sum, value) => sum + value, 0);
  const previousMonthTotal = previousMonth.reduce((sum, value) => sum + value, 0);

  const maxWeek = Math.max(...currentWeek.map((item) => item.orders), ...previousWeek);
  const maxMonth = Math.max(...currentMonth, ...previousMonth);

  const weekDiff = currentWeekTotal - previousWeekTotal;
  const monthDiff = currentMonthTotal - previousMonthTotal;

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 rounded-3xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Statistiques préparation
          </h2>
          <p className="text-sm font-medium text-slate-300">
            Comparaison des commandes préparées.
          </p>
        </div>

        <div className="flex rounded-2xl border border-[#008cff]/20 bg-[#020617]/80 p-1">
          <button
            onClick={() => setMode("week")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "week"
                ? "border border-[#008cff]/40 bg-[#006bff]/20 text-[#7df9ff]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Semaine
          </button>

          <button
            onClick={() => setMode("month")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "month"
                ? "border border-[#008cff]/40 bg-[#006bff]/20 text-[#7df9ff]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mois
          </button>
        </div>
      </div>

      {mode === "week" ? (
        <>
          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-4">
              <p className="text-sm font-medium text-slate-300">Semaine actuelle</p>
              <p className="mt-1 text-lg font-bold text-white">
                {currentWeekTotal.toLocaleString("fr-FR")} commandes
              </p>
            </div>

            <div className="rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-4">
              <p className="text-sm font-medium text-slate-300">Semaine précédente</p>
              <p className="mt-1 text-lg font-bold text-white">
                {previousWeekTotal.toLocaleString("fr-FR")} commandes
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">Évolution</p>
              <p className="mt-1 text-lg font-bold text-emerald-300">
                +{weekDiff.toLocaleString("fr-FR")} commandes
              </p>
            </div>
          </div>

          <div className="flex h-64 items-end gap-4 rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-5">
            {currentWeek.map((item, index) => (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-40 w-full items-end justify-center gap-2">
                  <div className="flex h-full w-1/2 items-end rounded-xl bg-[#0b1d33]">
                    <div
                      className="w-full rounded-xl bg-slate-300 transition-all duration-700"
                      style={{ height: `${(previousWeek[index] / maxWeek) * 100}%` }}
                    />
                  </div>

                  <div className="flex h-full w-1/2 items-end rounded-xl bg-[#0b1d33]">
                    <div
                      className="w-full rounded-xl bg-[#00e5ff]/80 transition-all duration-700"
                      style={{ height: `${(item.orders / maxWeek) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-white">{item.day}</p>
                  <p className="text-xs text-slate-400">{item.date}</p>
                  <p className="text-xs font-bold text-[#00e5ff]">{item.orders}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-4">
              <p className="text-sm font-medium text-slate-300">Mois actuel</p>
              <p className="mt-1 text-lg font-bold text-white">
                {currentMonthTotal.toLocaleString("fr-FR")} commandes
              </p>
            </div>

            <div className="rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-4">
              <p className="text-sm font-medium text-slate-300">Mois précédent</p>
              <p className="mt-1 text-lg font-bold text-white">
                {previousMonthTotal.toLocaleString("fr-FR")} commandes
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-4">
              <p className="text-sm text-emerald-300">Évolution</p>
              <p className="mt-1 text-lg font-bold text-emerald-300">
                +{monthDiff.toLocaleString("fr-FR")} commandes
              </p>
            </div>
          </div>

          <div className="flex h-64 items-end gap-2 overflow-x-auto rounded-2xl border border-[#008cff]/25 bg-[#071426]/85 p-5">
            {currentMonth.map((orders, index) => (
              <div key={index} className="flex min-w-10 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1">
                  <div className="flex h-full w-1/2 items-end rounded-lg bg-[#0b1d33]">
                    <div
                      className="w-full rounded-lg bg-slate-300 transition-all duration-700"
                      style={{
                        height:
                          previousMonth[index] === 0
                            ? "3%"
                            : `${(previousMonth[index] / maxMonth) * 100}%`,
                        opacity: previousMonth[index] === 0 ? 0.25 : 1,
                      }}
                    />
                  </div>

                  <div className="flex h-full w-1/2 items-end rounded-lg bg-[#0b1d33]">
                    <div
                      className="w-full rounded-lg bg-[#00e5ff]/80 transition-all duration-700"
                      style={{
                        height: orders === 0 ? "3%" : `${(orders / maxMonth) * 100}%`,
                        opacity: orders === 0 ? 0.25 : 1,
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-400">{index + 1}</p>
                <p className="text-xs font-bold text-[#00e5ff]">{orders}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}