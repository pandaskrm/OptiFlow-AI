import { SimulationState } from "./simulationTypes";

export const initialSimulation: SimulationState = {
  trucksWaiting: 2,
  occupiedDocks: 3,
  activeReceptions: 4,
  completedToday: 18,
  warehouseHealth: 91,

  events: [
    {
      id: 1,
      time: "08:05",
      title: "Camion DHL arrivé",
      description: "Le transporteur attend l'attribution d'un quai.",
      type: "truck",
    },
    {
      id: 2,
      time: "08:12",
      title: "Quai 2 occupé",
      description: "Déchargement des palettes en cours.",
      type: "dock",
    },
    {
      id: 3,
      time: "08:21",
      title: "Contrôle qualité",
      description: "Inspection automatique lancée.",
      type: "reception",
    },
    {
      id: 4,
      time: "08:34",
      title: "Analyse IA",
      description: "Aucun risque majeur détecté.",
      type: "ai",
    },
  ],
};