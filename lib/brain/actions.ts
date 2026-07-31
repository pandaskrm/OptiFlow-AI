export type AssistantAction =
  | "OPEN_DASHBOARD"
  | "OPEN_RECEPTION"
  | "OPEN_SHIPPING"
  | "OPEN_STOCK"
  | "OPEN_TEAM"
  | "OPEN_SETTINGS"
  | "OPEN_EXECUTIVE"
  | "OPEN_AI"
  | "OPEN_ERP"
  | "OPEN_DEMO"
  | "NONE";

export function getAssistantAction(question: string): AssistantAction {
  const q = question.toLowerCase();

  if (q.includes("dashboard") || q.includes("tableau de bord"))
    return "OPEN_DASHBOARD";

  if (q.includes("réception") || q.includes("reception"))
    return "OPEN_RECEPTION";

  if (
    q.includes("expédition") ||
    q.includes("expedition") ||
    q.includes("shipping")
  )
    return "OPEN_SHIPPING";

  if (q.includes("stock"))
    return "OPEN_STOCK";

  if (q.includes("équipe") || q.includes("equipe"))
    return "OPEN_TEAM";

  if (
    q.includes("paramètre") ||
    q.includes("parametre") ||
    q.includes("setting")
  )
    return "OPEN_SETTINGS";

  if (
    q.includes("direction") ||
    q.includes("executive")
  )
    return "OPEN_EXECUTIVE";

  if (
    q.includes("ia") ||
    q.includes("copilote")
  )
    return "OPEN_AI";

  if (
    q.includes("erp") ||
    q.includes("sage") ||
    q.includes("sap") ||
    q.includes("odoo") ||
    q.includes("cegid")
  )
    return "OPEN_ERP";

  if (
    q.includes("démo") ||
    q.includes("demo")
  )
    return "OPEN_DEMO";

  return "NONE";
}
