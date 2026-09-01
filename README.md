# 통신비피커

질문 4개에 답하면 「지금보다 1년에 얼마 아끼는지」와 갈아탈 요금제를
원문 근거(공시 링크 + 확인 날짜)와 함께 보여 주는 곳.
베네핏(가제) 우산의 3번째 칸 — 요금제·알뜰폰 비교.

- 설계: `docs/superpowers/specs/2026-09-01-telecompicker-design.md`
- 실행 계획: `docs/superpowers/plans/2026-09-01-telecompicker-build.md`
- 결정 대장: `docs/data-collection/DECIDED.md` — **갈래는 이 문서를 맨 먼저 읽는다**
- 작업 규칙: `CLAUDE.md`

## 검사

배포에 영향을 주는 확인은 반드시:

```bash
npm run build   # = vitest run && tsc -b && vite build
```

부분 확인은 `npx tsc -b` (`--noEmit` 아님). vitest 통과만으로 「배포된다」고 말하지 않는다.

## 세 원칙

부풀리지 않는다 · 돈으로 말한다("1년에 얼마") · 증명한다(원문 링크 + 확인 날짜)
