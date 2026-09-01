import { PlansFileSchema, type Plan } from './schema'

// src/data/plans/<계열>.json 을 전부 읽는다 (계열마다 한 파일 — 갈래 소유권 단위)
const modules = import.meta.glob('./plans/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>

export const rawPlanFiles: Record<string, unknown> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path, mod.default]),
)

export const allPlans: Plan[] = Object.values(rawPlanFiles).flatMap((rows) =>
  PlansFileSchema.parse(rows),
)
