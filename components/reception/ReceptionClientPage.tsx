"use client";

import { useEffect, useState } from "react";
import useSimulationV2 from "../../hooks/useSimulationV2";

import ReceptionForm from "./ReceptionForm";
import ReceptionStats from "./ReceptionStats";
import ReceptionTable from "./ReceptionTable";
import ReceptionDemoTable from "./ReceptionDemoTable";
import DockPlanning from "./DockPlanning";
import ReceptionHistory from "./ReceptionHistory";

export default function ReceptionClientPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState<"operations" | "history">("operations");
  const simulation = useSimulationV2();

  useEffect(() => {
    function handleReceptionUpdate() {
      setRefreshKey((current) => current + 1);
    }

    window.addEventListener(
      "optiflow:receptions-updated",
      handleReceptionUpdate,
    );

    return () => {
      window.removeEventListener(
        "optiflow:receptions-updated",
        handleReceptionUpdate,
      );
    };
  }, []);

  function refresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      <section className="organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-2xl border border-[#008cff]/75 bg-gradient-to-r from-[#020617] via-[#061426] to-[#00265c] px-5 py-5 shadow-[0_0_22px_rgba(0,140,255,0.25),0_0_55px_rgba(0,107,255,0.12),inset_0_0_30px_rgba(0,140,255,0.05)] sm:px-6">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent shadow-[0_0_18px_rgba(0,229,255,0.85)]" />

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#008cff]/20 blur-3xl" />

          <div className="absolute right-[20%] top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-[#00e5ff]/10 shadow-[0_0_80px_rgba(0,140,255,0.20)]" />

          <div className="absolute right-[24%] top-1/2 h-px w-48 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div className="min-w-0">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#00e5ff]/55 bg-[#006bff]/15 text-xl shadow-[0_0_18px_rgba(0,229,255,0.28),inset_0_0_14px_rgba(0,140,255,0.10)]">
                📥
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.50)]">
                  Module Réception
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Réception intelligente
                </h1>
              </div>

            </div>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Pilotage temps réel des arrivées, transporteurs, quais,
              palettes et opérations de réception.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">

            <div className="min-w-[120px] rounded-xl border border-[#008cff]/45 bg-[#020617]/80 px-3 py-2.5 shadow-[inset_0_0_14px_rgba(0,107,255,0.06)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Mode
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {simulation.running ? "Démo" : "Opérationnel"}
              </p>
            </div>

            <div className="min-w-[105px] rounded-xl border border-[#008cff]/45 bg-[#020617]/80 px-3 py-2.5 shadow-[inset_0_0_14px_rgba(0,107,255,0.06)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Quais
              </p>

              <p className="mt-1 text-sm font-black text-[#7df9ff]">
                6 actifs
              </p>
            </div>

            <div className="min-w-[135px] rounded-xl border border-[#00e5ff]/40 bg-[#006bff]/10 px-3 py-2.5 shadow-[0_0_18px_rgba(0,140,255,0.12)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Intelligence IA
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />

                <p className="text-sm font-black text-[#00e5ff]">
                  Surveillance
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#008cff]/30 bg-[#020617]/70 p-1.5 sm:max-w-md">
        <button
          type="button"
          onClick={() => setActiveView("operations")}
          className={`min-h-11 rounded-xl px-4 text-sm font-black transition ${
            activeView === "operations"
              ? "border border-[#00e5ff]/50 bg-[#008cff]/20 text-[#7df9ff] shadow-[0_0_14px_rgba(0,229,255,0.10)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Opérations
        </button>

        <button
          type="button"
          onClick={() => setActiveView("history")}
          className={`min-h-11 rounded-xl px-4 text-sm font-black transition ${
            activeView === "history"
              ? "border border-[#00e5ff]/50 bg-[#008cff]/20 text-[#7df9ff] shadow-[0_0_14px_rgba(0,229,255,0.10)]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Historique
        </button>
      </div>

      {activeView === "operations" ? (
        <>
          <ReceptionStats refreshKey={refreshKey} />

      {!simulation.running && (
        <ReceptionForm onSaved={refresh} />
      )}

      <DockPlanning refreshKey={refreshKey} />

          {simulation.running ? (
            <ReceptionDemoTable />
          ) : (
            <ReceptionTable
              refreshKey={refreshKey}
              onDeleted={refresh}
            />
          )}
        </>
      ) : (
        <ReceptionHistory />
      )}
    </div>
  );
}