"use client";

type WarehouseHealthProps = {
  health: number;
  sourceLabel: string;
  hasData: boolean;
};

export default function WarehouseHealth({
  health,
  sourceLabel,
  hasData,
}: WarehouseHealthProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-400">
            SANTÉ DE L'ENTREPÔT
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            {health}%
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {sourceLabel}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            hasData
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {hasData ? "CONNECTÉ" : "AUCUNE DONNÉE"}
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${health}%` }}
        />
      </div>
    </section>
  );
}