export const RULES = {
  // 소진 후 이 속도(Mbps) 이상이면 「기본량이 모자라도 계속 쓸 수 있다」로 본다.
  // 3Mbps = 일반 화질 영상이 끊기지 않는 수준. ⚠️ 근거 재검토 대상 — DECIDED.md 「아직 안 정해진 것」
  minUsableThrottleMbps: 3,
  // 통화 필요량(분): low 거의 안 함 / mid 보통 / high 많이(무제한만)
  voiceNeedMinutes: { low: 100, mid: 300, high: Infinity },
  // 결과 화면에 보여 줄 최대 개수
  topN: 10,
  // 일 단위 데이터를 「충분한가」 비교에만 월로 환산할 때 쓰는 날수 (적게 세는 쪽 — 31일 아님)
  daysPerMonth: 30,
  // 3사 선택약정 할인율 (참고 표시용 — 계산·정렬엔 안 쓴다, 게이트 2 결정)
  mnoContractDiscountRate: 0.25,
} as const
