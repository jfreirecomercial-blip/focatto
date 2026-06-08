import plansData from "./plans.json";

export interface Plan {
  id: string;
  name: string;
  tier: string;
  priceMonthly: number;
  priceYearlyMonthly: number; // Preço mensal equivalente se pago anualmente
  features: string[];
  highlight?: boolean;
  status: "active" | "future" | "deprecated";
  icon: string; // Ex: "star", "wrench", "crown", "megaphone"
  badgeText?: string;
  description: string;
}

export const PLANS = plansData as Plan[];
export default PLANS;
