"use client";

type Action = {
  label: string;
  icon: string;
};

const actions: Action[] = [
  { icon: "📊", label: "Dashboard" },
  { icon: "📦", label: "Réceptions" },
  { icon: "🚚", label: "Expéditions" },
  { icon: "📦", label: "Stock" },
  { icon: "👥", label: "Équipe" },
  { icon: "⚙️", label: "ERP" },
  { icon: "📋", label: "Briefing" },
];

export default function AssistantQuickActions() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="flex min-h-16 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-2 py-2 text-center transition hover:border-cyan-500/50 hover:bg-cyan-500/10"
        >
          <span className="text-lg">{action.icon}</span>
          <span className="mt-1 text-[10px] font-medium text-slate-300">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
