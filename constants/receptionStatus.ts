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
];

export function getNextStatus(current: string) {
  const index = STATUS_ORDER.indexOf(current);

  if (index === -1) return current;
  if (index === STATUS_ORDER.length - 1) return current;

  return STATUS_ORDER[index + 1];
}