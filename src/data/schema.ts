import { z } from 'zod'

export const NETWORKS = ['SKT', 'KT', 'LGU+'] as const

export const PlanSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    carrier: z.string().min(1), // 파는 회사 (예: "SK텔레콤", "KT엠모바일")
    carrierType: z.enum(['mno', 'mvno']), // mno = 통신 3사, mvno = 알뜰폰
    network: z.enum(NETWORKS), // 쓰는 통신망
    name: z.string().min(1),
    generation: z.enum(['5G', 'LTE']),
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
    throttleMbps: z.number().positive().nullable(), // 소진 후 속도. null = 소진 후 제공 없음
    voiceMinutes: z.number().int().nonnegative().nullable(), // 월 통화(분). null = 무제한
    smsIncluded: z.boolean(),
    sourceUrl: z.string().url(), // 원문(공시) 링크
    checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    memo: z.string().optional(),
  })
  .strict()

export type Plan = z.infer<typeof PlanSchema>
export const PlansFileSchema = z.array(PlanSchema)
