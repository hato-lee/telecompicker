import { z } from 'zod'

export const NETWORKS = ['SKT', 'KT', 'LGU+'] as const

export const PlanSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    carrier: z.string().min(1), // 파는 회사 (예: "SK텔레콤", "KT엠모바일")
    carrierType: z.enum(['mno', 'mvno']), // mno = 통신 3사, mvno = 알뜰폰
    network: z.enum(NETWORKS), // 쓰는 통신망
    name: z.string().min(1),
    generation: z.enum(['5G', 'LTE', '5G/LTE']), // '5G/LTE' = 통합·겸용 (KT 통합요금제, SKT 베스트/라이트 — 2026-09-01 총괄 판정)
    monthlyFee: z.number().int().nonnegative(), // 제값(할인 없는 달의 월 요금, 원)
    promo: z
      .object({
        months: z.number().int().positive(), // 할인 달수
        feeDuring: z.number().int().nonnegative(), // 할인 기간의 월 요금(원)
        note: z.string().optional(),
      })
      .strict()
      .nullable(), // 특가 없으면 null
    dataGB: z.number().nonnegative().nullable(), // 월 기본 데이터(GB). null = 무제한
    dailyDataGB: z.number().positive().nullable(), // 매일 주는 데이터(GB, 「월 11GB + 매일 2GB」의 2). null = 없음 (게이트 2 결정 2026-09-01)
    throttleMbps: z.number().positive().nullable(), // 소진 후 속도. null = 소진 후 제공 없음
    voiceMinutes: z.number().int().nonnegative().nullable(), // 월 통화(분). null = 무제한
    smsIncluded: z.boolean(),
    // 가입 가능 만 나이 (원문 문구 그대로 옮긴다 — 문구를 인용 못 하면 그 요금제는 담지 않는다)
    ageMin: z.number().int().nonnegative().nullable(), // 예: 시니어 「만 65세 이상」 → 65. null = 하한 없음
    ageMax: z.number().int().nonnegative().nullable(), // 예: 청년 「만 34세 이하」 → 34. null = 상한 없음
    // 연령 자동 혜택 변종(예: KT Y덤). 원판 요금제 id — 추천 목록에 변종이 있으면 원판은 접는다 (2026-09-02 결정)
    variantOf: z.string().regex(/^[a-z0-9-]+$/).nullable(),
    sourceUrl: z.string().url(), // 원문(공시) 링크
    checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    memo: z.string().optional(),
  })
  .strict()

export type Plan = z.infer<typeof PlanSchema>
export const PlansFileSchema = z.array(PlanSchema)
