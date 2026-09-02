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
    dailyDataGB: null,
    throttleMbps: null,
    voiceMinutes: null,
    smsIncluded: true,
    ageMin: null,
    ageMax: null,
    variantOf: null,
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
  age: { min: 35, max: 64 },
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
  test('일 단위 데이터는 비교에만 월로 환산된다 (11GB + 매일 2GB ≥ 15GB)', () => {
    const daily = plan({ id: 'j', dataGB: 11, dailyDataGB: 2 })
    expect(recommend(input, [daily])).toHaveLength(1)
  })
  test('연령 전용은 나이 구간 전체가 조건 안일 때만 남는다', () => {
    const youth = plan({ id: 'k', ageMax: 34 })
    const senior = plan({ id: 'l', ageMin: 65 })
    const anyone = plan({ id: 'm' })
    // 35~64세 → 청년·시니어 다 빠진다
    expect(recommend(input, [youth, senior, anyone]).map((r) => r.plan.id)).toEqual(['m'])
    // 정확히 만 27세 → 청년(만 34세 이하)이 남는다
    const at27 = { ...input, age: { min: 27, max: 27 } }
    expect(recommend(at27, [youth, senior, anyone]).map((r) => r.plan.id).sort()).toEqual(['k', 'm'])
    // 19~34 구간에 「만 29세 이하」 요금제 — 걸쳐 있으면 안전하게 뺀다
    const under29 = plan({ id: 'n', ageMax: 29 })
    const bracket = { ...input, age: { min: 19, max: 34 } }
    expect(recommend(bracket, [under29]).map((r) => r.plan.id)).toEqual([])
    // 나이를 안 밝히면 연령 전용은 전부 뺀다
    expect(recommend({ ...input, age: null }, [youth, senior, anyone]).map((r) => r.plan.id)).toEqual(['m'])
  })
  test('연령 변종(덤)이 자격에 들면 원판은 접힌다', () => {
    const base = plan({ id: 'base-7gb', dataGB: 7, dailyDataGB: null })
    const dum = plan({ id: 'base-7gb-ydum', dataGB: 14, ageMin: 19, ageMax: 34, variantOf: 'base-7gb', dailyDataGB: null })
    // 27세: 덤 자격 → 원판 접히고 덤만
    const at27 = { ...input, dataGBNeeded: 5, age: { min: 27, max: 27 } }
    expect(recommend(at27, [base, dum]).map((r) => r.plan.id)).toEqual(['base-7gb-ydum'])
    // 50세: 덤 자격 없음 → 원판만
    const at50 = { ...input, dataGBNeeded: 5, age: { min: 50, max: 50 } }
    expect(recommend(at50, [base, dum]).map((r) => r.plan.id)).toEqual(['base-7gb'])
  })
  test('지금보다 비싼 요금제도 목록엔 남는다 (화면이 「이미 좋아요」를 판단)', () => {
    const pricey = plan({ id: 'i', monthlyFee: 90000 })
    const out = recommend(input, [pricey])
    expect(out).toHaveLength(1)
    expect(out[0].annualSaving).toBeLessThan(0)
  })
})
