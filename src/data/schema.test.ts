import { describe, expect, test } from 'vitest'
import { PlanSchema } from './schema'

const valid = {
  id: 'skt-baro-5g-69',
  carrier: 'SK텔레콤',
  carrierType: 'mno',
  network: 'SKT',
  name: '5GX 프라임 (예시)',
  generation: '5G',
  monthlyFee: 69000,
  promo: null,
  dataGB: null, // null = 무제한
  throttleMbps: null,
  voiceMinutes: null, // null = 무제한
  smsIncluded: true,
  sourceUrl: 'https://example.com/notice',
  checkedAt: '2026-09-01',
  memo: '스키마 검사용 합성 예제 — 실제 요금제 아님',
}

describe('PlanSchema', () => {
  test('올바른 요금제를 받아들인다', () => {
    expect(() => PlanSchema.parse(valid)).not.toThrow()
  })
  test('통합(5G/LTE) 요금제를 받아들인다', () => {
    expect(() =>
      PlanSchema.parse({ ...valid, id: 'kt-unified', generation: '5G/LTE' }),
    ).not.toThrow()
  })
  test('특가 요금제를 받아들인다', () => {
    expect(() =>
      PlanSchema.parse({
        ...valid,
        id: 'mvno-promo',
        promo: { months: 7, feeDuring: 0 },
      }),
    ).not.toThrow()
  })
  // 일부러 깨진 입력 — 검사가 항등식이 아님을 증명한다
  test.each([
    ['id에 대문자', { ...valid, id: 'SKT-Plan' }],
    ['음수 요금', { ...valid, monthlyFee: -100 }],
    ['소수점 요금', { ...valid, monthlyFee: 69000.5 }],
    ['날짜 형식 위반', { ...valid, checkedAt: '2026.09.01' }],
    ['원문 링크 없음', { ...valid, sourceUrl: '공시 페이지' }],
    ['특가에 달수 없음', { ...valid, promo: { feeDuring: 0 } }],
    ['모르는 칸', { ...valid, extra: 1 }],
    ['통신망 오타', { ...valid, network: 'LGU' }],
  ])('%s → 거부한다', (_label, broken) => {
    expect(() => PlanSchema.parse(broken)).toThrow()
  })
})
