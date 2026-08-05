type KpiCardProps = {
  title: string;
  value: string;
  trend: string;
  progress: number;
};

const KPI_ICONS: Record<string, string> = {
  Commandes: "📦",
  Expéditions: "🚚",
  Réceptions: "📥",
  Service: "⭐",
  Productivité: "⚡",
  "Santé dépôt": "🏭",
};

function getProgressStyle(progress: number) {
  if (progress >= 85) {
    return {
      bar: "bg-emerald-400",
      badge:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      result: "text-emerald-400",
      label: "Excellente",
    };
  }

  if (progress >= 60) {
    return {
      bar: "bg-cyan-400",
      badge:
        "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      result: "text-cyan-400",
      label: "Sous contrôle",
    };
  }

  return {
    bar: "bg-orange-400",
    badge:
      "border-orange-500/30 bg-orange-500/10 text-orange-300",
    result: "text-orange-400",
    label: "À surveiller",
  };
}

export default function KpiCard({
  title,
  value,
  trend,
  progress,
}: KpiCardProps) {
  const safeProgress = Math.max(
    0,
    Math.min(100, progress),
  );

  const icon = KPI_ICONS[title] ?? "📊";
  const style = getProgressStyle(safeProgress);

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3 shadow-lg transition duration-300 hover:border-cyan-500/30 hover:shadow-xl sm:p-3 lg:p-4">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-lg shadow-inner sm:h-10 sm:w-10 sm:text-lg">
              {icon}
            </span>

            <div className="min-w-0">
              <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:block">
                Indicateur
              </p>

              <h3 className="truncate text-sm font-bold text-slate-200 sm:mt-1 sm:text-base">
                {title}
              </h3>
            </div>
          </div>

          <span
            className="hidden"
          >
            {trend}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 sm:mt-4">
          <p className="text-3xl font-black tracking-tight text-white sm:text-3xl">
            {value}
          </p>

          <p className="pb-1 text-[11px] font-semibold text-slate-500 sm:text-xs">
            {safeProgress} %
          </p>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800 sm:mt-3 sm:h-1.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] sm:mt-3 sm:text-xs">
          <span className="truncate text-slate-600">
            Performance
          </span>

          <span
            className={`shrink-0 font-semibold ${style.result}`}
          >
            {style.label}
          </span>
        </div>

        <p className={`mt-2 truncate border-t border-slate-800/80 pt-2 text-[10px] font-medium sm:text-[11px] ${safeProgress === 0 ? "text-orange-300" : "text-slate-600"}`}>
          {trend}
        </p>
      </div>
    </article>
  );
}
