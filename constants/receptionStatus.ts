export const RECEPTION_STATUS = {
  PLANNED: "Planifiée",
  AT_DOCK: "À quai",
  UNLOADING: "Déchargement",
  INSPECTION: "Contrôle qualité",
  COMPLETED: "Terminée",
} as const;

export const STATUS_ORDER = [
  RECEPTION_STATUS.PLANNED,
  RECEPTION_STATUS.AT_DOCK,
  RECEPTION_STATUS.UNLOADING,
  RECEPTION_STATUS.INSPECTION,
  RECEPTION_STATUS.COMPLETED,
] as const;

export function getNextStatus(current: string) {
  const index = STATUS_ORDER.indexOf(current as any);

  if (index === -1 || index === STATUS_ORDER.length - 1) {
    return current;
  }

  return STATUS_ORDER[index + 1];
}

export function getStatusColor(status: string) {
  switch (status) {
    case RECEPTION_STATUS.PLANNED:
      return "bg-blue-500/20 text-blue-400";

    case RECEPTION_STATUS.AT_DOCK:
      return "bg-orange-500/20 text-orange-400";

    case RECEPTION_STATUS.UNLOADING:
      return "bg-yellow-500/20 text-yellow-400";

    case RECEPTION_STATUS.INSPECTION:
      return "bg-purple-500/20 text-purple-400";

    case RECEPTION_STATUS.COMPLETED:
      return "bg-green-500/20 text-green-400";

    default:
      return "bg-slate-500/20 text-slate-300";
  }
}