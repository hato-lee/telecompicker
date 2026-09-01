import type { Plan } from '../data/schema'

/** 1년 실제 납부액(원). 특가는 할인 달수만큼만 할인가로 센다 — 부풀리지 않는다. */
export function annualCost(plan: Plan): number {
  if (!plan.promo) return plan.monthlyFee * 12
  const promoMonths = Math.min(plan.promo.months, 12)
  return plan.promo.feeDuring * promoMonths + plan.monthlyFee * (12 - promoMonths)
}
