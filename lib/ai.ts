export type Recommendation = {
  type: "warning" | "success" | "info" | "gain";
  title: string;
  message: string;
};

export function getDailyRecommendations(): Recommendation[] {
  return [
    {
      type: "warning",
      title: "Commandes prioritaires",
      message: "3 commandes risquent d'être expédiées en retard.",
    },
    {
      type: "success",
      title: "Productivité",
      message: "La préparation est en avance de 12 % sur l'objectif.",
    },
    {
      type: "info",
      title: "Transport",
      message: "Le quai 4 sera disponible dans 15 minutes.",
    },
    {
      type: "gain",
      title: "Temps gagné",
      message: "L'IA estime un gain potentiel de 1 h 47 aujourd'hui.",
    },
  ];
}