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
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      glow: "group-hover:shadow-emerald-950/30",
    };
  }

  if (progress >= 60) {
    return {
      bar: "bg-cyan-400",
      badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
      glow: "group-hover:shadow-cyan-950/30",
    };
  }

  return {
    bar: "bg-orange-400",
    badge: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    glow: "group-hover:shadow-orange-950/30",
  };
}

export default function KpiCard({
  title,
  value,
  trend,
  progress,
}: KpiCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const icon = KPI_ICONS[title] ?? "📊";
  const style = getProgressStyle(safeProgress);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-2xl ${style.glow}`}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl transition group-hover:bg-cyan-500/10" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-xl shadow-inner">
              {icon}
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Indicateur
              </p>

              <h3 className="mt-1 font-semibold text-slate-200">
                {title}
              </h3>
            </div>
          </div>

          <span
            className={`max-w-[120px] rounded-full border px-2.5 py-1 text-right text-[10px] font-semibold leading-4 ${style.badge}`}
          >
            {trend}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <p className="text-4xl font-black tracking-tight text-white">
            {value}
          </p>

          <p className="pb-1 text-xs font-semibold text-slate-400">
            {safeProgress} %
          </p>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
            style={{ width: `${safeProgress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500">Performance actuelle</span>

          <span
            className={
              safeProgress >= 85
                ? "font-semibold text-emerald-400"
                : safeProgress >= 60
                  ? "font-semibold text-cyan-400"
                  : "font-semibold text-orange-400"
            }
          >
            {safeProgress >= 85
              ? "Excellente"
              : safeProgress >= 60
                ? "Sous contrôle"
                : "À surveiller"}
          </span>
        </div>
      </div>
    </article>
  );
}