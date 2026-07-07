import { SimulationEvent } from "./simulationTypes";

const events: SimulationEvent[] = [
  {
    id: 1,
    time: "08:00",
    title: "Camion DHL arrivé",
    description: "Le camion attend l'attribution d'un quai.",
    type: "truck",
  },
  {
    id: 2,
    time: "08:05",
    title: "Quai 2 occupé",
    description: "Déchargement démarré.",
    type: "dock",
  },
  {
    id: 3,
    time: "08:12",
    title: "Contrôle qualité",
    description: "Inspection des palettes.",
    type: "reception",
  },
  {
    id: 4,
    time: "08:20",
    title: "Analyse IA",
    description: "Aucun risque majeur détecté.",
    type: "ai",
  },
  {
    id: 5,
    time: "08:28",
    title: "Réception terminée",
    description: "Marchandise mise en stock.",
    type: "reception",
  },
];

export function getDemoEvents() {
  return events;
}