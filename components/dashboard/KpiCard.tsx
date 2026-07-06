type KpiCardProps = {
  title: string;
  value: string;
  trend: string;
  progress: number;
};

export default function KpiCard({
  title,
  value,
  trend,
  progress,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-slate-400">{title}</h3>

        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-400">
          {trend}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold text-white">{value}</p>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Performance actuelle : {progress}%
      </p>
    </div>
  );
}