import { describe, expect, test } from 'vitest'
import type { Plan } from '../data/schema'
import { annualCost } from './annualCost'

const base: Plan = {
  id: 'test-plan',
  carrier: '검사',
  carrierType: 'mvno',
  network: 'KT',
  name: '검사용',
  generation: 'LTE',
  monthlyFee: 20000,
  promo: null,
  dataGB: 11,
  dailyDataGB: null,
  throttleMbps: 3,
  voiceMinutes: null,
  smsIncluded: true,
  ageMin: null,
  ageMax: null,
  variantOf: null,
  sourceUrl: 'https://example.com',
  checkedAt: '2026-09-01',
}

describe('annualCost — 1년 실제 납부액', () => {
  test('특가 없음: 제값 × 12', () => {
    expect(annualCost(base)).toBe(240000)
  })
  test('특가 7개월 0원: 0×7 + 20000×5', () => {
    expect(annualCost({ ...base, promo: { months: 7, feeDuring: 0 } })).toBe(100000)
  })
  test('특가가 12개월을 넘으면 12개월로 자른다', () => {
    expect(annualCost({ ...base, promo: { months: 24, feeDuring: 5000 } })).toBe(60000)
  })
  test('부풀리기 방지: 특가 요금 × 12로 세지 않는다', () => {
    const cost = annualCost({ ...base, promo: { months: 6, feeDuring: 1000 } })
    expect(cost).not.toBe(12000) // 첫 달 가격 × 12 (거짓말)
    expect(cost).toBe(1000 * 6 + 20000 * 6)
  })
})
