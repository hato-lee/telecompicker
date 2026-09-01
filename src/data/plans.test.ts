// ⭐ 실데이터를 스키마에 넣는 검사 (합성 예제 시험이 아니다)
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
