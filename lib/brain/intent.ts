export type AssistantIntent =
  | "ERP_CONNECT"
  | "MORNING_BRIEF"
  | "WAREHOUSE_STATUS"
  | "OPEN_DASHBOARD"
  | "UNKNOWN";

export function detectIntent(question: string): AssistantIntent {
  const q = question.toLowerCase();

  if (
    q.includes("erp") &&
    (
      q.includes("connect") ||
      q.includes("config") ||
      q.includes("sage") ||
      q.includes("sap") ||
      q.includes("odoo") ||
      q.includes("cegid")
    )
  ) return "ERP_CONNECT";

  if (
    q.includes("bonjour") ||
    q.includes("salut") ||
    q.includes("hello") ||
    q.includes("coucou")
  ) return "MORNING_BRIEF";

  if (
    q.includes("comment va") ||
    q.includes("etat") ||
    q.includes("état") ||
    q.includes("kpi") ||
    q.includes("depot") ||
    q.includes("dépôt")
  ) return "WAREHOUSE_STATUS";

  if (
    q.includes("dashboard") ||
    q.includes("tableau de bord")
  ) return "OPEN_DASHBOARD";

  return "UNKNOWN";
}
