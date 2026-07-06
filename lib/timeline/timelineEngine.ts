import { RECEPTION_STATUS } from "../../constants/receptionStatus";
import { Reception } from "../../types/reception";

export function generateReceptionTimeline(reception: Reception) {
  const steps = [
    {
      label: "Réception planifiée",
      icon: "📅",
      done: true,
      description: "La réception est enregistrée dans OptiFlow AI.",
    },
    {
      label: "Camion à quai",
      icon: "🚛",
      done: reception.status !== RECEPTION_STATUS.PLANNED,
      description: "Le transporteur est arrivé et un quai est attribué.",
    },
    {
      label: "Déchargement",
      icon: "📦",
      done:
        reception.status === RECEPTION_STATUS.UNLOADING ||
        reception.status === RECEPTION_STATUS.INSPECTION ||
        reception.status === RECEPTION_STATUS.COMPLETED,
      description: "Les palettes sont en cours de déchargement.",
    },
    {
      label: "Contrôle qualité",
      icon: "🔍",
      done:
        reception.status === RECEPTION_STATUS.INSPECTION ||
        reception.status === RECEPTION_STATUS.COMPLETED,
      description: "La réception est contrôlée avant validation.",
    },
    {
      label: "Réception terminée",
      icon: "✅",
      done: reception.status === RECEPTION_STATUS.COMPLETED,
      description: "La réception est clôturée.",
    },
  ];

  const completedSteps = steps.filter((step) => step.done).length;
  const progress = Math.round((completedSteps / steps.length) * 100);

  return {
    steps,
    progress,
  };
}