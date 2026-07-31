export type BrainSkill = {
  name: string;
  keywords: string[];
};

import { dashboardSkill } from "./skills/dashboard";
import { receptionSkill } from "./skills/reception";
import { shippingSkill } from "./skills/shipping";
import { stockSkill } from "./skills/stock";
import { teamSkill } from "./skills/team";
import { executiveSkill } from "./skills/executive";
import { erpSkill } from "./skills/erp";
import { reportsSkill } from "./skills/reports";

const skills: BrainSkill[] = [
  { name: dashboardSkill.name, keywords: ["dashboard","kpi","entrepot","dépôt","depot","performance"] },
  { name: receptionSkill.name, keywords: ["reception","réception","quai","camion"] },
  { name: shippingSkill.name, keywords: ["expedition","expédition","transport","livraison"] },
  { name: stockSkill.name, keywords: ["stock","inventaire","rupture"] },
  { name: teamSkill.name, keywords: ["equipe","équipe","utilisateur","employe","préparateur"] },
  { name: executiveSkill.name, keywords: ["direction","dirigeant","patron","briefing"] },
  { name: erpSkill.name, keywords: ["erp","sage","sap","odoo","cegid","dynamics"] },
  { name: reportsSkill.name, keywords: ["rapport","analyse","résumé","resume"] },
];

export function detectSkill(question: string): string {
  const q = question.toLowerCase();

  for (const skill of skills) {
    if (skill.keywords.some(keyword => q.includes(keyword))) {
      return skill.name;
    }
  }

  return "dashboard";
}
