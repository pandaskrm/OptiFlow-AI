export type PreparationPriority = "Haute" | "Moyenne" | "Basse";
export type PreparationStatus =
  | "En attente"
  | "En préparation"
  | "Contrôle"
  | "Terminée";

export type PreparationOrder = {
  id: string;
  customer: string;
  picker: string;
  priority: PreparationPriority;
  status: PreparationStatus;
  progress: number;
  lines: number;
  deadline: string;
};