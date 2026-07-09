import { executiveStats } from "@/lib/executive/executiveData";

export default function ExecutiveHealthScore() {
  const score = executiveStats.warehouseHealth;

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
        Score exploitation
      </p>

      <div className="mt-4 flex items-end gap-3">
        <p className="text-6xl font-black text-emerald-300">{score}</p>
        <p className="mb-2 text-xl font-bold text-slate-300">/100</p>
      </div>

      <p className="mt-4 text-sm text-slate-300">
        L'exploitation est stable. Les principaux points de vigilance concernent
        la préparation et les absences du matin.
      </p>

      <div className="mt-6 space-y-3">
        {[
          ["Productivité", "+4"],
          ["Service", "+2"],
          ["Absences", "-3"],
          ["Retards", "-2"],
          ["Qualité", "+3"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between rounded-2xl bg-white/5 p-3">
            <span className="text-sm text-slate-300">{label}</span>
            <span className="font-bold text-cyan-300">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}