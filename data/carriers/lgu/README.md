# LG유플러스 — 원문 길

- 시작점: `https://www.lguplus.com/mobile/plan/mplan/5g-all` (5G 전체) · LTE는 사이트 안 탭에서
- 상태 (2026-09-01, 총괄): **정적 HTML엔 요금제가 없다** — 자바스크립트 렌더 후에만 보인다.
  → playwright로 렌더해서 긁는다. 세부 길(목록 API·상세 페이지 URL 형식)은 **아직 안 뚫었다.**
- 스마트초이스 발견 목록의 LGU+ 요금제: `../smartchoice/sources/planlist-*-discovery.json`의
  `mnoPlanList`에서 `TEL_NAME == "LGU+"`.
- 스냅샷 규칙: `sources/<요금제id>-<YYYY-MM-DD>-<목적>.md` — 덮어쓰지 않는다.

## 뒤진 곳 (길이 막혔던 기록)

- (아직 없음)
