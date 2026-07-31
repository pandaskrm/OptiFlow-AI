export type Workflow =
  | "CREATE_RECEPTION"
  | "CREATE_SHIPPING"
  | "CREATE_STOCK_MOVEMENT"
  | "CONNECT_ERP"
  | "START_DEMO"
  | "NONE";

export function detectWorkflow(question: string): Workflow {
  const q = question.toLowerCase();

  if (
    q.includes("crée une réception") ||
    q.includes("nouvelle réception") ||
    q.includes("ajoute une réception")
  ) {
    return "CREATE_RECEPTION";
  }

  if (
    q.includes("crée une expédition") ||
    q.includes("nouvelle expédition")
  ) {
    return "CREATE_SHIPPING";
  }

  if (
    q.includes("mouvement de stock") ||
    q.includes("transfert de stock")
  ) {
    return "CREATE_STOCK_MOVEMENT";
  }

  if (
    q.includes("connecte mon erp") ||
    q.includes("configuration erp")
  ) {
    return "CONNECT_ERP";
  }

  if (
    q.includes("mode démo") ||
    q.includes("lance la démo")
  ) {
    return "START_DEMO";
  }

  return "NONE";
}
