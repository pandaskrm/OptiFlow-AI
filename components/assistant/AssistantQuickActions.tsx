"use client";

type Action = {
  label: string;
  icon: string;
  prompt: string;
};

type AssistantQuickActionsProps = {
  actions: Action[];
  onAction: (prompt: string) => void;
};

export default function AssistantQuickActions({
  actions,
  onAction,
}: AssistantQuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => onAction(action.prompt)}
          className="flex min-h-20 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-2 py-3 text-center transition hover:border-cyan-500/50 hover:bg-cyan-500/10 active:scale-[0.98]"
        >
          <span className="text-xl">
            {action.icon}
          </span>

          <span className="mt-2 text-[11px] font-semibold text-slate-300">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
