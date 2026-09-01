import type { Plan } from '../data/schema'
import { annualCost } from './annualCost'
import { RULES } from './rules'

export interface UserInput {
  currentNetwork: 'SKT' | 'KT' | 'LGU+' | '알뜰폰' // 결합할인 방의 첫 재료 — 지금은 저장만
  currentMonthlyFee: number
  dataGBNeeded: number // Infinity = 무제한이 있어야 함
  voice: 'low' | 'mid' | 'high'
  mvnoOk: boolean
}

export interface Recommendation {
  plan: Plan
  annualCost: number
  annualSaving: number // 지금 1년 납부액 − 이 요금제 1년 납부액
}

export function hasEnoughData(plan: Plan, neededGB: number): boolean {
  if (plan.dataGB === null) return true
  if (plan.dataGB >= neededGB) return true
  return plan.throttleMbps !== null && plan.throttleMbps >= RULES.minUsableThrottleMbps
}

export function hasEnoughVoice(plan: Plan, voice: UserInput['voice']): boolean {
  if (plan.voiceMinutes === null) return true
  return plan.voiceMinutes >= RULES.voiceNeedMinutes[voice]
}

export function recommend(input: UserInput, plans: Plan[]): Recommendation[] {
  const currentAnnual = input.currentMonthlyFee * 12
  return plans
    .filter((p) => (input.mvnoOk ? true : p.carrierType === 'mno'))
    .filter((p) => hasEnoughData(p, input.dataGBNeeded))
    .filter((p) => hasEnoughVoice(p, input.voice))
    .map((p) => {
      const cost = annualCost(p)
      return { plan: p, annualCost: cost, annualSaving: currentAnnual - cost }
    })
    .sort((a, b) => b.annualSaving - a.annualSaving)
}
