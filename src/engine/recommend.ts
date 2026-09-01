import type { Plan } from '../data/schema'
import { annualCost } from './annualCost'
import { RULES } from './rules'

export interface UserInput {
  currentNetwork: 'SKT' | 'KT' | 'LGU+' | '알뜰폰' // 결합할인 방의 첫 재료 — 지금은 저장만
  currentMonthlyFee: number
  dataGBNeeded: number // Infinity = 무제한이 있어야 함
  voice: 'low' | 'mid' | 'high'
  // 만 나이 구간. 정확한 나이면 min=max. null = 안 밝힘 → 연령 전용 요금제는 전부 뺀다(안전한 쪽)
  age: { min: number; max: number | null } | null
  mvnoOk: boolean
}

export interface Recommendation {
  plan: Plan
  annualCost: number
  annualSaving: number // 지금 1년 납부액 − 이 요금제 1년 납부액
}

export function hasEnoughData(plan: Plan, neededGB: number): boolean {
  if (plan.dataGB === null) return true
  // 일 단위 추가분은 비교(충분한가)에만 환산해 쓴다 — 담는 값·화면 표기는 원문 그대로 (게이트 2 결정)
  const monthlyTotal = plan.dataGB + (plan.dailyDataGB ?? 0) * RULES.daysPerMonth
  if (monthlyTotal >= neededGB) return true
  return plan.throttleMbps !== null && plan.throttleMbps >= RULES.minUsableThrottleMbps
}

// 연령 전용 요금제는 사용자의 나이 「구간 전체」가 조건 안에 들어갈 때만 권한다.
// 구간이 걸쳐 있으면(예: 19~34세 구간에 「만 29세 이하」 요금제) 가입 못 하는 분께 권할 수 있으니 뺀다.
export function isAgeEligible(plan: Plan, age: UserInput['age']): boolean {
  if (plan.ageMin === null && plan.ageMax === null) return true
  if (age === null) return false
  if (plan.ageMin !== null && age.min < plan.ageMin) return false
  if (plan.ageMax !== null && (age.max === null || age.max > plan.ageMax)) return false
  return true
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
    .filter((p) => isAgeEligible(p, input.age))
    .map((p) => {
      const cost = annualCost(p)
      return { plan: p, annualCost: cost, annualSaving: currentAnnual - cost }
    })
    .sort((a, b) => b.annualSaving - a.annualSaving)
}
