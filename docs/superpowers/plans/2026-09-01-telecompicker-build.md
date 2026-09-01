# 통신비피커 1차 공사 실행 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 질문 4개에 답하면 "1년에 얼마 아끼는지"와 갈아탈 요금제를 원문 근거와 함께 보여 주는 화면을, 게이트 2(화면 첫 모습 승인) 직전까지 만든다.

**Architecture:** 카드피커와 같은 정적 SPA. 요금제 데이터는 `src/data/plans/<계열>.json`(계열마다 한 파일 — 갈래 소유권을 가르기 위해)에 담고, zod 스키마가 전부 검증한다. 계산 엔진(연 납부액·추천)은 순수 함수로 두고 vitest로 검사한다. 화면은 버튼 마법사 4장 + 결과 1장.

**Tech Stack:** Vite + React + TypeScript · zod · vitest · brand/tokens.css

**Spec:** `docs/superpowers/specs/2026-09-01-telecompicker-design.md`

## Global Constraints

- 검사는 **`npm run build`** = `vitest run && tsc -b && vite build` (카드피커와 동일). 부분 확인도 **`npx tsc -b`** (`--noEmit` 금지).
- vitest 통과만으로 「배포된다」고 말하지 않는다.
- UI 문구는 쉬운 한국어. 서비스 이름은 **"통신비피커"** (베네핏은 가제라 노출 최소).
- **지어내지 않는다**: `src/data/plans/*.json`의 모든 값은 `data/carriers/<계열>/sources/` 스냅샷과 짝이고 `sourceUrl` + `checkedAt`을 가진다. 확인 못 한 값은 담지 않고 `memo`에 「원문이 말하지 않는다」.
- 계산은 **1년 실제 납부액** 기준. 특가는 `할인가 × 할인 달수 + 제값 × 나머지 달수`. 화면에 「M개월째부터 월 ○원」 필수.
- 데이터·통화가 모자라는 요금제는 싸도 추천하지 않는다.
- 갈래를 띄울 때 `model` 반드시 명시 (`docs/MODEL-ROLES.md`). 갈래 지시문에 `docs/data-collection/DECIDED.md`를 붙인다.
- 색은 `brand/tokens.css` 변수만 쓴다. 치장은 최소.
- `git add -A` 금지 — 파일 경로를 하나씩 add.

---

### Task 1: Vite 뼈대 + 빌드 명령 + GitHub 저장소

**Files:**
- Create: Vite react-ts 템플릿 전체 (`package.json`, `index.html`, `src/main.tsx` 등)
- Modify: `package.json` (build 스크립트), `index.html` (제목·lang)

**Interfaces:**
- Produces: `npm run build`가 `vitest run && tsc -b && vite build`로 도는 프로젝트 뼈대. 이후 모든 태스크가 이 검사 명령을 쓴다.

- [ ] **Step 1: 템플릿을 임시 폴더에 만들어 옮긴다** (현재 폴더가 비어 있지 않아서)

```bash
cd /Users/hato/Projects/telecompicker
npm create -y vite@latest _scaffold -- --template react-ts
rsync -a --exclude .gitignore _scaffold/ ./   # .gitignore는 우리 것(갈래 규약 포함)을 지킨다
rm -rf _scaffold
npm install
npm install zod
npm install -D vitest
```

- [ ] **Step 2: `package.json` 스크립트를 카드피커 규약으로 맞춘다**

```json
"scripts": {
  "dev": "vite",
  "build": "vitest run && tsc -b && vite build",
  "typecheck": "tsc -b --noEmit",
  "test": "vitest",
  "preview": "vite preview"
}
```

⚠️ vitest 검사 파일이 아직 없다. `vitest run`은 검사 0개면 실패(기본 `--passWithNoTests` 아님)하므로, Task 2가 끝나기 전까지는 build가 실패할 수 있다 — Task 1에서는 `vitest run --passWithNoTests`가 아니라, **Step 4에서 임시 자리표시 검사 하나를 만들어** build를 통과시킨다.

- [ ] **Step 3: `index.html` 손보기**

`<html lang="ko">`, `<title>통신비피커 — 1년에 얼마 아끼는지</title>`.

- [ ] **Step 4: 자리표시 검사 파일**

```ts
// src/smoke.test.ts — Task 2에서 진짜 검사가 생기면 지운다
import { expect, test } from 'vitest'
test('vitest가 돈다', () => { expect(1 + 1).toBe(2) })
```

- [ ] **Step 5: 빌드 확인**

Run: `npm run build`
Expected: vitest 1 passed → tsc → vite build 성공.

- [ ] **Step 6: 커밋 + GitHub 저장소**

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts src/ public/ eslint.config.js
git status   # 눈으로 읽는다 — 엉뚱한 파일이 없는지
git commit -m "뼈대: Vite+React+TS, 검사는 npm run build (vitest && tsc -b && vite build)"
gh repo create telecompicker --public --source=. --push
```

`gh`가 없거나 로그인이 안 되어 있으면: 푸시는 건너뛰고 보고서에 「GitHub 연결 못 함 — 하토님 로그인 필요」라고 적는다. 계속 진행은 가능하다.

---

### Task 2: 요금제 스키마 (TDD)

**Files:**
- Create: `src/data/schema.ts`
- Test: `src/data/schema.test.ts`
- Delete: `src/smoke.test.ts`

**Interfaces:**
- Produces: `PlanSchema`, `PlansFileSchema`, `type Plan`, `NETWORKS`. 이후 모든 태스크가 이 타입을 쓴다.

- [ ] **Step 1: 실패하는 검사부터 쓴다**

```ts
// src/data/schema.test.ts
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
  dataGB: null,           // null = 무제한
  throttleMbps: null,
  voiceMinutes: null,     // null = 무제한
  smsIncluded: true,
  sourceUrl: 'https://example.com/notice',
  checkedAt: '2026-09-01',
  memo: '스키마 검사용 합성 예제 — 실제 요금제 아님',
}

describe('PlanSchema', () => {
  test('올바른 요금제를 받아들인다', () => {
    expect(() => PlanSchema.parse(valid)).not.toThrow()
  })
  test('특가 요금제를 받아들인다', () => {
    expect(() => PlanSchema.parse({
      ...valid, id: 'mvno-promo', promo: { months: 7, feeDuring: 0 },
    })).not.toThrow()
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
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/data/schema.test.ts`
Expected: FAIL — `./schema` 모듈 없음.

- [ ] **Step 3: 스키마 구현**

```ts
// src/data/schema.ts
import { z } from 'zod'

export const NETWORKS = ['SKT', 'KT', 'LGU+'] as const

export const PlanSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    carrier: z.string().min(1),            // 파는 회사 (예: "SK텔레콤", "KT엠모바일")
    carrierType: z.enum(['mno', 'mvno']),  // mno = 통신 3사, mvno = 알뜰폰
    network: z.enum(NETWORKS),             // 쓰는 통신망
    name: z.string().min(1),
    generation: z.enum(['5G', 'LTE']),
    monthlyFee: z.number().int().nonnegative(),       // 제값(할인 없는 달의 월 요금, 원)
    promo: z
      .object({
        months: z.number().int().positive(),          // 할인 달수
        feeDuring: z.number().int().nonnegative(),    // 할인 기간의 월 요금(원)
        note: z.string().optional(),
      })
      .strict()
      .nullable(),                                    // 특가 없으면 null
    dataGB: z.number().nonnegative().nullable(),      // 월 기본 데이터(GB). null = 무제한
    throttleMbps: z.number().positive().nullable(),   // 소진 후 속도. null = 소진 후 제공 없음
    voiceMinutes: z.number().int().nonnegative().nullable(), // 월 통화(분). null = 무제한
    smsIncluded: z.boolean(),
    sourceUrl: z.string().url(),                      // 원문(공시) 링크
    checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    memo: z.string().optional(),
  })
  .strict()

export type Plan = z.infer<typeof PlanSchema>
export const PlansFileSchema = z.array(PlanSchema)
```

- [ ] **Step 4: 통과 확인 + smoke 삭제 + 전체 빌드**

```bash
npx vitest run src/data/schema.test.ts   # PASS
rm src/smoke.test.ts
npm run build                            # PASS
```

- [ ] **Step 5: 커밋**

```bash
git add src/data/schema.ts src/data/schema.test.ts
git rm src/smoke.test.ts
git commit -m "데이터: 요금제 스키마 + 일부러 깨진 입력 8종 검사"
```

---

### Task 3: 요금제 적재기 + 실데이터 검사

**Files:**
- Create: `src/data/loadPlans.ts`, `src/data/plans/.gitkeep`
- Test: `src/data/plans.test.ts`

**Interfaces:**
- Consumes: `PlansFileSchema`, `Plan` (Task 2)
- Produces: `allPlans: Plan[]` — 화면과 엔진이 쓰는 유일한 데이터 입구. 계열 파일을 `src/data/plans/<계열>.json`에 두면 자동으로 합쳐진다.

- [ ] **Step 1: 실패하는 검사**

```ts
// src/data/plans.test.ts — ⭐ 실데이터를 스키마에 넣는 검사 (합성 예제 시험이 아니다)
import { describe, expect, test } from 'vitest'
import { PlansFileSchema } from './schema'
import { allPlans, rawPlanFiles } from './loadPlans'

describe('실데이터 plans/*.json', () => {
  test('모든 파일이 스키마를 통과한다', () => {
    for (const [path, rows] of Object.entries(rawPlanFiles)) {
      expect(() => PlansFileSchema.parse(rows), path).not.toThrow()
    }
  })
  test('id가 전체에서 겹치지 않는다', () => {
    const ids = allPlans.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  // 항등식 방지 — 깨진 줄을 심으면 정말 잡는가
  test('깨진 줄을 심으면 잡는다', () => {
    const broken = [...allPlans.map((p) => ({ ...p })), { id: 'broken' }]
    expect(() => PlansFileSchema.parse(broken)).toThrow()
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/data/plans.test.ts`
Expected: FAIL — `./loadPlans` 없음.

- [ ] **Step 3: 적재기 구현**

```ts
// src/data/loadPlans.ts
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
```

`mkdir -p src/data/plans && touch src/data/plans/.gitkeep` (아직 파일 0개 — 검사는 빈 목록으로도 돈다).

- [ ] **Step 4: 통과 확인 + 빌드**

```bash
npx vitest run src/data/plans.test.ts   # PASS (파일 0개, id 0개)
npm run build                           # PASS
```

- [ ] **Step 5: 커밋**

```bash
git add src/data/loadPlans.ts src/data/plans.test.ts src/data/plans/.gitkeep
git commit -m "데이터: 계열별 plans/*.json 적재기 + 실데이터 검사(깨진 줄 심기 포함)"
```

---

### Task 4: 연 납부액 엔진 (TDD)

**Files:**
- Create: `src/engine/annualCost.ts`
- Test: `src/engine/annualCost.test.ts`

**Interfaces:**
- Consumes: `Plan` (Task 2)
- Produces: `annualCost(plan: Plan): number` — 1년 실제 납부액(원)

- [ ] **Step 1: 실패하는 검사**

```ts
// src/engine/annualCost.test.ts
import { describe, expect, test } from 'vitest'
import type { Plan } from '../data/schema'
import { annualCost } from './annualCost'

const base: Plan = {
  id: 'test-plan', carrier: '검사', carrierType: 'mvno', network: 'KT',
  name: '검사용', generation: 'LTE', monthlyFee: 20000, promo: null,
  dataGB: 11, throttleMbps: 3, voiceMinutes: null, smsIncluded: true,
  sourceUrl: 'https://example.com', checkedAt: '2026-09-01',
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
    expect(cost).not.toBe(12000)   // 첫 달 가격 × 12 (거짓말)
    expect(cost).toBe(1000 * 6 + 20000 * 6)
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/engine/annualCost.test.ts` → FAIL (모듈 없음)

- [ ] **Step 3: 구현**

```ts
// src/engine/annualCost.ts
import type { Plan } from '../data/schema'

/** 1년 실제 납부액(원). 특가는 할인 달수만큼만 할인가로 센다 — 부풀리지 않는다. */
export function annualCost(plan: Plan): number {
  if (!plan.promo) return plan.monthlyFee * 12
  const promoMonths = Math.min(plan.promo.months, 12)
  return plan.promo.feeDuring * promoMonths + plan.monthlyFee * (12 - promoMonths)
}
```

- [ ] **Step 4: 통과 확인**

Run: `npx vitest run src/engine/annualCost.test.ts` → PASS, 이어서 `npm run build` → PASS

- [ ] **Step 5: 커밋**

```bash
git add src/engine/annualCost.ts src/engine/annualCost.test.ts
git commit -m "엔진: 1년 실제 납부액 (특가는 할인 달수만큼만)"
```

---

### Task 5: 추천 엔진 (TDD)

**Files:**
- Create: `src/engine/rules.ts`, `src/engine/recommend.ts`
- Test: `src/engine/recommend.test.ts`

**Interfaces:**
- Consumes: `Plan`, `annualCost`
- Produces: `UserInput`, `Recommendation`, `recommend(input, plans): Recommendation[]` (절약액 큰 순), `RULES`

- [ ] **Step 1: 실패하는 검사**

```ts
// src/engine/recommend.test.ts
import { describe, expect, test } from 'vitest'
import type { Plan } from '../data/schema'
import { recommend, type UserInput } from './recommend'

function plan(over: Partial<Plan>): Plan {
  return {
    id: 'p', carrier: '검사', carrierType: 'mvno', network: 'KT', name: '검사',
    generation: 'LTE', monthlyFee: 20000, promo: null, dataGB: 20,
    throttleMbps: null, voiceMinutes: null, smsIncluded: true,
    sourceUrl: 'https://example.com', checkedAt: '2026-09-01', ...over,
  }
}
const input: UserInput = {
  currentNetwork: 'SKT', currentMonthlyFee: 50000,
  dataGBNeeded: 15, voice: 'mid', mvnoOk: true,
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
    const a = plan({ id: 'g', monthlyFee: 30000 })   // 연 36만 → 절약 24만
    const b = plan({ id: 'h', monthlyFee: 10000 })   // 연 12만 → 절약 48만
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
```

- [ ] **Step 2: 실패 확인**

Run: `npx vitest run src/engine/recommend.test.ts` → FAIL

- [ ] **Step 3: 구현**

```ts
// src/engine/rules.ts
export const RULES = {
  // 소진 후 이 속도(Mbps) 이상이면 「기본량이 모자라도 계속 쓸 수 있다」로 본다.
  // 3Mbps = 일반 화질 영상이 끊기지 않는 수준. ⚠️ 근거 재검토 대상 — DECIDED.md 「아직 안 정해진 것」
  minUsableThrottleMbps: 3,
  // 통화 필요량(분): low 거의 안 함 / mid 보통 / high 많이(무제한만)
  voiceNeedMinutes: { low: 100, mid: 300, high: Infinity },
  // 결과 화면에 보여 줄 최대 개수
  topN: 10,
} as const
```

```ts
// src/engine/recommend.ts
import type { Plan } from '../data/schema'
import { annualCost } from './annualCost'
import { RULES } from './rules'

export interface UserInput {
  currentNetwork: 'SKT' | 'KT' | 'LGU+' | '알뜰폰'  // 결합할인 방의 첫 재료 — 지금은 저장만
  currentMonthlyFee: number
  dataGBNeeded: number        // Infinity = 무제한이 있어야 함
  voice: 'low' | 'mid' | 'high'
  mvnoOk: boolean
}

export interface Recommendation {
  plan: Plan
  annualCost: number
  annualSaving: number        // 지금 1년 납부액 − 이 요금제 1년 납부액
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
```

- [ ] **Step 4: 통과 확인**

`npx vitest run src/engine/recommend.test.ts` → PASS · `npm run build` → PASS

- [ ] **Step 5: 커밋**

```bash
git add src/engine/rules.ts src/engine/recommend.ts src/engine/recommend.test.ts
git commit -m "엔진: 추천 (모자라면 제외·절약액순 정렬·규칙은 rules.ts 한 곳)"
```

---

### Task 6: 수집 길 뚫기 — 총괄이 직접 (갈래 아님)

⚠️ 이 태스크는 코드가 아니라 **웹 조사**다. 총괄이 이 세션에서 직접 한다 (처음 뚫는 길은 값싼 모델 몫이 아니다 — MODEL-ROLES).

**Files:**
- Create: `data/carriers/README.md` (원문을 「어떻게 보나」의 지도)
- Create: `data/carriers/{skt,kt,lgu}/README.md` + `sources/` 폴더

- [ ] **Step 1: 스마트초이스 요금제 목록 길 확인** — smartchoice.or.kr 에서 요금제 비교 목록을 어떻게 뽑는지(URL·검색 조건) 확인하고 `data/carriers/README.md`에 적는다. 못 찾으면 **뒤진 곳 목록**을 적는다.
- [ ] **Step 2: 3사 공시 페이지 길 확인** — SKT(T월드 요금제)·KT·LG유플러스 각 공시/요금제 안내 페이지 URL과 「요금제 상세를 보는 법」을 각 계열 README에 적는다.
- [ ] **Step 3: 스냅샷 1개씩 시험 채취** — 계열마다 요금제 1개를 `sources/<요금제id>-2026-XX-XX-first.md`로 떠 보고, README의 길 설명이 실제로 통하는지 확인한다.
- [ ] **Step 4: 커밋** — `git add data/carriers/` 후 커밋 `"수집: 원문 길 지도 (스마트초이스 + 3사 공시)"`.

---

### Task 7: 3사 요금제 수집 라운드 — 갈래 3개

⚠️ **갈래 오케스트레이션** — 총괄이 이 세션에서 갈래를 띄운다. 갈래 규약은 CLAUDE.md §3.

**Files (갈래별 소유권):**
- 갈래 SKT: `data/carriers/skt/**` + `src/data/plans/skt.json`
- 갈래 KT: `data/carriers/kt/**` + `src/data/plans/kt.json`
- 갈래 LGU: `data/carriers/lgu/**` + `src/data/plans/lgu.json`

- [ ] **Step 1: 갈래 지시문 준비.** 각 지시문에 반드시 넣는다: ① `docs/data-collection/DECIDED.md` 전문 ② 스키마(`src/data/schema.ts`)와 칸 뜻 ③ 「모르겠으면 값을 비우고 memo에 『원문이 말하지 않는다』라고 적어라」 ④ 검사 명령 `npx vitest run src/data/plans.test.ts && npx tsc -b` ⑤ 스냅샷 규칙(덮어쓰기 금지) ⑥ 소유 파일 밖은 건드리지 말 것.
- [ ] **Step 2: 갈래 3개를 `model: opus`로 띄운다** (처음 뚫는 계열 = opus. Sonnet 5 시험은 길이 뚫린 뒤인 Task 9에서). 범위: 현재 신규 가입 가능한 휴대폰 요금제 전부 (5G·LTE).
- [ ] **Step 3: 갈래가 도는 동안** `docs/OPEN-ISSUES.md`(판)를 만들어 라운드 상태를 적는다.
- [ ] **Step 4: 합치기 전 검증** — 총괄이 계열마다 요금제 2~3개를 원문과 직접 대조. `git ls-files -s node_modules` 확인. 갈래 파일만 하나씩 `git add`.
- [ ] **Step 5: `npm run build` 통과 확인 후 커밋.**

---

### Task 8: 알뜰폰 명단 안 → 하토님 결정

- [ ] **Step 1: 명단 안 만들기** — 스마트초이스 등록 알뜰폰 사업자 + 가입자 규모 자료(공식 출처)를 보고 10~15곳 안을 만든다. 기준: 3사 자회사 전부 + 이용자 많은 대형.
- [ ] **Step 2: 하토님께 안을 보여 드리고 결정받는다** (AskUserQuestion).
- [ ] **Step 3: 그날 안에 `docs/data-collection/DECIDED.md`에 명단을 적고 커밋.**

---

### Task 9: 알뜰폰 수집 라운드 — 갈래 (Sonnet 5 시험 포함)

⚠️ **갈래 오케스트레이션.** Task 7과 같은 지시문 틀. 사업자마다 `data/carriers/<사업자id>/**` + `src/data/plans/<사업자id>.json` 소유.

- [ ] **Step 1: 총괄이 사업자 1곳의 길을 먼저 뚫어** README 틀을 만든다 (알뜰폰 공시 페이지 모양 파악).
- [ ] **Step 2: 갈래를 띄운다** — 한둘은 `model: sonnet`(**Sonnet 5 시험 운행** — 길이 뚫린 자회사 계열), 나머지는 `opus`. ⚠️ 특가(프로모션) 조건 — 할인 달수·이후 제값 — 이 이 라운드의 판정 핵심이다. sonnet 갈래에는 판정을 넘기지 않는다: 애매하면 비우고 memo.
- [ ] **Step 3: 총괄 대조** — sonnet 갈래 결과는 요금제 여러 개를 원문과 직접 대조하고, 확대 여부 판정을 기록한다 (MODEL-ROLES 품질 확인).
- [ ] **Step 4: `npm run build` 통과 후 커밋. 판 갱신.**

---

### Task 10: 버튼 마법사 화면 + 결과 화면

**Files:**
- Create: `src/ui/App.tsx`, `src/ui/screens.tsx`, `src/ui/Result.tsx`, `src/ui/format.ts`, `src/styles.css`
- Modify: `src/main.tsx` (App 경로·tokens.css 임포트), 템플릿 잔재 삭제 (`src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/react.svg`)

**Interfaces:**
- Consumes: `allPlans`, `recommend`, `UserInput`, `Recommendation`, `RULES`, `annualCost`
- Produces: 완성된 마법사 흐름 (질문 4장 → 결과). 게이트 2의 대상.

- [ ] **Step 1: 돈 표기 도우미 (TDD)**

```ts
// src/ui/format.test.ts
import { expect, test } from 'vitest'
import { won } from './format'

test('won: 천 단위 쉼표 + 원', () => {
  expect(won(348000)).toBe('348,000원')
  expect(won(0)).toBe('0원')
})
```

```ts
// src/ui/format.ts
export function won(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`
}
```

Run: `npx vitest run src/ui/format.test.ts` → PASS

- [ ] **Step 2: 마법사 뼈대**

```tsx
// src/ui/App.tsx
import { useState } from 'react'
import type { UserInput } from '../engine/recommend'
import { ScreenCarrierFee, ScreenData, ScreenVoice, ScreenMvno } from './screens'
import { Result } from './Result'

type Step = 0 | 1 | 2 | 3 | 4

export function App() {
  const [step, setStep] = useState<Step>(0)
  const [input, setInput] = useState<Partial<UserInput>>({})

  const patch = (p: Partial<UserInput>, next: Step) => {
    setInput((prev) => ({ ...prev, ...p }))
    setStep(next)
  }

  return (
    <main className="wizard">
      <header className="brand-bar">통신비피커</header>
      {step < 4 && (
        <div className="progress" aria-label={`4단계 중 ${step + 1}단계`}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={i <= step ? 'dot on' : 'dot'} />
          ))}
        </div>
      )}
      {step > 0 && step < 4 && (
        <button className="back" onClick={() => setStep((step - 1) as Step)}>← 이전</button>
      )}
      {step === 0 && <ScreenCarrierFee onNext={(p) => patch(p, 1)} />}
      {step === 1 && <ScreenData onNext={(p) => patch(p, 2)} />}
      {step === 2 && <ScreenVoice onNext={(p) => patch(p, 3)} />}
      {step === 3 && <ScreenMvno onNext={(p) => patch(p, 4)} />}
      {step === 4 && <Result input={input as UserInput} onRestart={() => { setInput({}); setStep(0) }} />}
    </main>
  )
}
```

- [ ] **Step 3: 질문 화면 4장**

```tsx
// src/ui/screens.tsx
import { useState } from 'react'
import type { UserInput } from '../engine/recommend'

type Next = (p: Partial<UserInput>) => void

const NETWORKS: UserInput['currentNetwork'][] = ['SKT', 'KT', 'LGU+', '알뜰폰']
const FEE_CHOICES = [
  { label: '3만 원쯤', value: 30000 },
  { label: '5만 원쯤', value: 50000 },
  { label: '7만 원쯤', value: 70000 },
  { label: '9만 원 넘게', value: 90000 },
]

export function ScreenCarrierFee({ onNext }: { onNext: Next }) {
  const [network, setNetwork] = useState<UserInput['currentNetwork'] | null>(null)
  const [custom, setCustom] = useState('')
  return (
    <section>
      <h1>지금 어디서, 한 달에 얼마쯤 내세요?</h1>
      <div className="btn-grid">
        {NETWORKS.map((n) => (
          <button key={n} className={network === n ? 'choice on' : 'choice'} onClick={() => setNetwork(n)}>
            {n}
          </button>
        ))}
      </div>
      {network && (
        <>
          <div className="btn-grid">
            {FEE_CHOICES.map((f) => (
              <button key={f.value} className="choice" onClick={() => onNext({ currentNetwork: network, currentMonthlyFee: f.value })}>
                {f.label}
              </button>
            ))}
          </div>
          <details className="side-door">
            <summary>정확한 금액을 알아요</summary>
            <input inputMode="numeric" placeholder="예: 55000" value={custom} onChange={(e) => setCustom(e.target.value)} />
            <button disabled={!/^\d{3,7}$/.test(custom)} onClick={() => onNext({ currentNetwork: network, currentMonthlyFee: Number(custom) })}>
              이 금액으로
            </button>
          </details>
        </>
      )}
    </section>
  )
}

const DATA_CHOICES = [
  { label: '조금만 (5GB 이하)', value: 5 },
  { label: '보통 (15GB쯤)', value: 15 },
  { label: '많이 (50GB쯤)', value: 50 },
  { label: '무제한이 필요해요', value: Infinity },
]

export function ScreenData({ onNext }: { onNext: Next }) {
  return (
    <section>
      <h1>한 달에 데이터를 얼마나 쓰세요?</h1>
      <p className="hint">잘 모르면: 와이파이 없이 영상을 자주 본다면 「많이」, 카톡·검색 위주면 「조금만」이 가까워요.</p>
      <div className="btn-grid">
        {DATA_CHOICES.map((d) => (
          <button key={d.label} className="choice" onClick={() => onNext({ dataGBNeeded: d.value })}>
            {d.label}
          </button>
        ))}
      </div>
    </section>
  )
}

const VOICE_CHOICES: { label: string; value: UserInput['voice']; hint: string }[] = [
  { label: '거의 안 해요', value: 'low', hint: '한 달 100분이면 충분' },
  { label: '보통이에요', value: 'mid', hint: '한 달 300분쯤' },
  { label: '많이 해요', value: 'high', hint: '무제한이 마음 편해요' },
]

export function ScreenVoice({ onNext }: { onNext: Next }) {
  return (
    <section>
      <h1>전화 통화는 많이 하세요?</h1>
      <div className="btn-col">
        {VOICE_CHOICES.map((v) => (
          <button key={v.value} className="choice" onClick={() => onNext({ voice: v.value })}>
            {v.label} <small>{v.hint}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

export function ScreenMvno({ onNext }: { onNext: Next }) {
  return (
    <section>
      <h1>알뜰폰도 괜찮으세요?</h1>
      <p className="hint">알뜰폰은 통신 3사의 통신망을 그대로 빌려 써요. 통화 품질은 같고, 멤버십·가족결합이 없는 대신 요금이 싸요.</p>
      <div className="btn-col">
        <button className="choice" onClick={() => onNext({ mvnoOk: true })}>네, 싸면 좋죠</button>
        <button className="choice" onClick={() => onNext({ mvnoOk: false })}>아니요, 3사가 좋아요</button>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: 결과 화면**

```tsx
// src/ui/Result.tsx
import { allPlans } from '../data/loadPlans'
import { recommend, type UserInput } from '../engine/recommend'
import { RULES } from '../engine/rules'
import { won } from './format'

export function Result({ input, onRestart }: { input: UserInput; onRestart: () => void }) {
  const all = recommend(input, allPlans)
  const savers = all.filter((r) => r.annualSaving > 0).slice(0, RULES.topN)
  const best = savers[0]

  return (
    <section className="result">
      {best ? (
        <>
          <p className="headline-label">갈아타면</p>
          <h1 className="big-number">1년에 {won(best.annualSaving)} 아껴요</h1>
          <p className="hint">
            계산: 지금 월 {won(input.currentMonthlyFee)} × 12개월 = 연 {won(input.currentMonthlyFee * 12)} 와
            아래 요금제의 <strong>1년 실제 납부액</strong>(특가 기간 + 제값 기간)을 비교했어요.
          </p>
        </>
      ) : (
        <>
          <h1 className="big-number">지금 요금제가 이미 좋아요</h1>
          <p className="hint">
            조건(데이터 {input.dataGBNeeded === Infinity ? '무제한' : `${input.dataGBNeeded}GB`}
            {input.mvnoOk ? '' : ' · 3사만'})에 맞으면서 지금보다 싼 요금제를
            {allPlans.length === 0 ? ' — 아직 요금제 데이터를 모으는 중이에요.' : ' 못 찾았어요.'}
          </p>
        </>
      )}
      <ol className="plan-list">
        {savers.map((r) => (
          <li key={r.plan.id} className="plan-card">
            <div className="plan-head">
              <strong>{r.plan.name}</strong>
              <span className="carrier">{r.plan.carrier} · {r.plan.network}망 {r.plan.generation}</span>
            </div>
            <div className="plan-fee">
              {r.plan.promo ? (
                <>
                  첫 {r.plan.promo.months}개월 월 {won(r.plan.promo.feeDuring)},{' '}
                  <strong>{r.plan.promo.months + 1}개월째부터 월 {won(r.plan.monthlyFee)}</strong>
                </>
              ) : (
                <>월 {won(r.plan.monthlyFee)}</>
              )}
            </div>
            <div className="plan-detail">
              데이터 {r.plan.dataGB === null ? '무제한' : `월 ${r.plan.dataGB}GB`}
              {r.plan.throttleMbps !== null && ` (다 쓰면 ${r.plan.throttleMbps}Mbps로 계속)`}
              {' · '}통화 {r.plan.voiceMinutes === null ? '무제한' : `월 ${r.plan.voiceMinutes}분`}
            </div>
            <div className="plan-annual">1년 납부액 {won(r.annualCost)} → <strong>{won(r.annualSaving)} 아껴요</strong></div>
            <a className="source-badge" href={r.plan.sourceUrl} target="_blank" rel="noreferrer">
              원문 보기 · 확인 {r.plan.checkedAt}
            </a>
          </li>
        ))}
      </ol>
      <button className="restart" onClick={onRestart}>처음부터 다시</button>
    </section>
  )
}
```

- [ ] **Step 5: 스타일 + 진입점** — `src/styles.css`는 `brand/tokens.css` 변수만 쓴다(꿀색 단추, 종이색 바탕, 큰 글자). `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../brand/tokens.css'
import './styles.css'
import { App } from './ui/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

템플릿 잔재 삭제: `git rm src/App.tsx src/App.css src/index.css src/assets/react.svg` (있는 것만).

`src/styles.css`는 실행 시점에 작성한다 — 규칙: 바탕 `--bene-paper`/글자 `--bene-ink`, 단추 `--bene-honey` + `--bene-honey-deep` 테두리, 모바일(360px) 우선, 다크는 이번엔 안 한다(치장 최소).

- [ ] **Step 6: 빌드 + 렌더 확인**

```bash
npm run build          # PASS 확인
npm run dev            # 띄워 두고
# playwright로 360×640 스크린샷: 질문 4장 각각 + 결과 화면(수집된 실데이터로)
```

⚠️ 화면 이야기는 스크린샷을 눈으로 본 뒤에만 한다. 렌더가 어긋나면 여기서 고친다.

- [ ] **Step 7: 커밋**

```bash
git add src/ui/App.tsx src/ui/screens.tsx src/ui/Result.tsx src/ui/format.ts src/ui/format.test.ts src/styles.css src/main.tsx
git rm src/App.tsx src/App.css src/index.css src/assets/react.svg
git commit -m "화면: 버튼 마법사 4장 + 결과 (특가 끝난 뒤 가격 명시, 원문 배지)"
```

---

### Task 11: 게이트 2 — 화면 첫 모습 승인

- [ ] **Step 1: 스크린샷 묶음 준비** — 질문 4장 + 결과 화면 (모바일 360px 기준, 실데이터).
- [ ] **Step 2: 하토님께 보여 드리고 승인 요청.** 고칠 점이 나오면 반영 후 다시.
- [ ] **Step 3: 결정을 그날 안에 `docs/data-collection/DECIDED.md`에 기록.**
- [ ] **Step 4: 이후 남는 일 정리** — 게이트 3(개업: Vercel 연결·배포)은 승인 후 별도로.

---

## Self-Review 메모 (계획 작성 후 점검)

- 설계 문서 대비: 범위·질문 4개·1년 실납부액·모자라면 제외·원문 배지·갈래 규약·Sonnet 시험 — 전부 태스크에 있음. 결합할인은 이번 범위 밖(입력에 `currentNetwork` 저장까지만) — Task 5 `UserInput`에 반영.
- `데이터 도우미("유튜브 몇 시간")`는 근거 출처가 아직 없어(DECIDED 「아직 안 정해진 것」) v1에서는 힌트 문장으로만 (ScreenData의 hint). 출처를 찾으면 별도 라운드.
- 타입 일관성: `Plan`·`UserInput`·`Recommendation`·`RULES`·`won` — 태스크 간 서명 일치 확인함.
- Task 6·7·9는 코드가 아니라 총괄의 웹 조사·갈래 오케스트레이션 태스크다. 서브에이전트에 통째로 맡기지 않는다.
