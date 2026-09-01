import { describe, expect, test } from 'vitest'
import type { Plan } from '../data/schema'
import { recommend, type UserInput } from './recommend'

function plan(over: Partial<Plan>): Plan {
  return {
    id: 'p',
    carrier: '검사',
    carrierType: 'mvno',
    network: 'KT',
    name: '검사',
    generation: 'LTE',
    monthlyFee: 20000,
    promo: null,
    dataGB: 20,
    throttleMbps: null,
    voiceMinutes: null,
    smsIncluded: true,
    sourceUrl: 'https://example.com',
    checkedAt: '2026-09-01',
    ...over,
  }
}
const input: UserInput = {
  currentNetwork: 'SKT',
  currentMonthlyFee: 50000,
  dataGBNeeded: 15,
  voice: 'mid',
  mvnoOk: true,
}

describe('recommend', () => {
  test('데이터가 모자라는 요금제는 싸도 빠진다', () => {
    const cheap = plan({ id: 'a', dataGB: 3, monthlyFee: 3000 })
    expect(recommend(input, [cheap])).toHaveLength(0)
  })
  test('기본량이 모자라도 소진 후 속도가 기준 이상이면 남는다', () => {
    const throttled = plan({ id: 'b', dataGB: 11, throttleMbps: 3 })
    expect(recommend(input, [throttled])).toHaveLength(1)
  })
  test('통화 많이(high)면 무제한만 남는다', () => {
    const limited = plan({ id: 'c', voiceMinutes: 300 })
    const unlimited = plan({ id: 'd', voiceMinutes: null })
    const out = recommend({ ...input, voice: 'high' }, [limited, unlimited])
    expect(out.map((r) => r.plan.id)).toEqual(['d'])
  })
  test('알뜰폰 싫다면 mvno가 빠진다', () => {
    const mvno = plan({ id: 'e' })
    const mno = plan({ id: 'f', carrierType: 'mno', carrier: 'SK텔레콤', network: 'SKT' })
    const out = recommend({ ...input, mvnoOk: false }, [mvno, mno])
    expect(out.map((r) => r.plan.id)).toEqual(['f'])
  })
  test('절약액 큰 순으로 정렬되고 값이 맞다', () => {
    const a = plan({ id: 'g', monthlyFee: 30000 }) // 연 36만 → 절약 24만
    const b = plan({ id: 'h', monthlyFee: 10000 }) // 연 12만 → 절약 48만
    const out = recommend(input, [a, b])
    expect(out.map((r) => r.plan.id)).toEqual(['h', 'g'])
    expect(out[0].annualSaving).toBe(50000 * 12 - 10000 * 12)
  })
  test('지금보다 비싼 요금제도 목록엔 남는다 (화면이 「이미 좋아요」를 판단)', () => {
    const pricey = plan({ id: 'i', monthlyFee: 90000 })
    const out = recommend(input, [pricey])
    expect(out).toHaveLength(1)
    expect(out[0].annualSaving).toBeLessThan(0)
  })
})
