export type ShippingPriority = "Haute" | "Moyenne" | "Basse";
export type ShippingStatus =
  | "En attente"
  | "En préparation quai"
  | "Chargement"
  | "Contrôle transport"
  | "Expédiée";

export type ShippingOrder = {
  id: string;
  customer: string;
  carrier: string;
  dock: string;
  priority: ShippingPriority;
  status: ShippingStatus;
  parcels: number;
  pallets: number;
  progress: number;
  departureTime: string;
};