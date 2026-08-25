"use client";

import { useEffect } from "react";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import useSimulationV2 from "../../hooks/useSimulationV2";
import { RECEPTION_STATUS } from "../../constants/receptionStatus";

type ReceptionStatsProps = {
  refreshKey: number;
};

export default function ReceptionStats({
  refreshKey,
}: ReceptionStatsProps) {
  const simulation = useSimulationV2();
  const {
    data: warehouse,
    loading,
    refresh,
  } = useWarehouseSummary();

  useEffect(() => {
    if (!simulation.running) {
      void refresh();
    }
  }, [refreshKey, simulation.running, refresh]);

  const receptions = warehouse.receptionDetails;
  const total = simulation.running
    ? simulation.state.kpis.receptions
    : receptions.length;

  const planned = simulation.running
    ? simulation.state.receptions.planned
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.PLANNED
      ).length;

  const atDock = simulation.running
    ? simulation.state.receptions.atDock
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.AT_DOCK
      ).length;

  const finished = simulation.running
    ? simulation.state.receptions.completed
    : receptions.filter(
        (reception) =>
          reception.status === RECEPTION_STATUS.COMPLETED
      ).length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="organia-electric-panel organia-electric-panel-v2 rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-4 shadow-[0_0_18px_rgba(0,140,255,0.16),inset_0_0_20px_rgba(0,107,255,0.04)] transition hover:-translate-y-0.5 hover:border-[#00e5ff]/75 hover:shadow-[0_0_28px_rgba(0,140,255,0.28)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Total réceptions</p>
        <p className="mt-2 text-3xl font-black">
          {loading ? "..." : total}
        </p>
      </div>

      <div className="organia-electric-panel organia-electric-panel-v2 rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-4 shadow-[0_0_18px_rgba(0,140,255,0.16),inset_0_0_20px_rgba(0,107,255,0.04)] transition hover:-translate-y-0.5 hover:border-[#00e5ff]/75 hover:shadow-[0_0_28px_rgba(0,140,255,0.28)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Planifiées</p>
        <p className="mt-2 text-3xl font-black text-blue-400">
          {loading ? "..." : planned}
        </p>
      </div>

      <div className="organia-electric-panel organia-electric-panel-v2 rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-4 shadow-[0_0_18px_rgba(0,140,255,0.16),inset_0_0_20px_rgba(0,107,255,0.04)] transition hover:-translate-y-0.5 hover:border-[#00e5ff]/75 hover:shadow-[0_0_28px_rgba(0,140,255,0.28)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">À quai</p>
        <p className="mt-2 text-3xl font-black text-green-400">
          {loading ? "..." : atDock}
        </p>
      </div>

      <div className="organia-electric-panel organia-electric-panel-v2 rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] p-4 shadow-[0_0_18px_rgba(0,140,255,0.16),inset_0_0_20px_rgba(0,107,255,0.04)] transition hover:-translate-y-0.5 hover:border-[#00e5ff]/75 hover:shadow-[0_0_28px_rgba(0,140,255,0.28)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">Terminées</p>
        <p className="mt-2 text-3xl font-black text-orange-400">
          {loading ? "..." : finished}
        </p>
      </div>
    </div>
  );
}
