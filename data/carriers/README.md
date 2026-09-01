# 원문 길 지도 — 어떻게 보나

⭐ 규약: 길을 찾으면 **그 자리에서** 이 파일(또는 계열 README)을 고친다.
못 찾았을 때도 **뒤진 곳 목록**을 적는다. 스냅샷은 「무엇을 봤나」, README는 「어떻게 보나」다.

## 스마트초이스 (발견용 — 요금제 목록 찾기)

- 운영: KTOA(한국통신사업자연합회) + 과학기술정보통신부. 요금제 비교 공식 포털.
- 비교 화면: `https://www.smartchoice.or.kr/smc/plan/planCompare.do` (목록은 JS로만 뜸)
- ⭐ **데이터 통로 (2026-09-01 뚫음)**: `POST /smc/plan/planCompareResult.do`
  - 본문(JSON): `{"ageType":"1","dataSpeed":"","usageData":"","minUsageData":"0","maxUsageData":"999999","deviceTypeList":["1"],"sort":"1","mnoPageNum":1,"mnoAmount":100,"mvnoPageNum":1,"mvnoAmount":100}`
  - `ageType`: 1 일반 · (청년/시니어/어린이/청소년 값은 화면 라디오에서 확인)
  - 응답: `mnoPlanList`(통신 3사) + `mvnoPlanList`(알뜰폰) + 각 `...Count`
  - 쓸 칸: `PLAN_SEQ`(고유번호) `PLAN_NAME` `TEL_NAME`(사업자) `TEL`(사업자 영문id)
    `MVNO_NETWORK`(망: SKT/KT/LG) `PLAN_TYPE_NAME`(5G/LTE/3G) `PLAN_PRICE`(월 요금)
    `PLAN_DISPLAY_DATA`(예: "4.5GB + 1Mbps 속도제어") `PLAN_DISPLAY_VOICE` `PLAN_DISPLAY_SMS`
    `AGE_TYPE_NAME` `MVNO_GOODS_TYPE`(HP/USIM)
  - 2026-09-01 기준 규모: 3사 264개 · 알뜰폰 893개
  - ⚠️ **연속 요청 6번쯤에서 대기 페이지(HTML)로 막힌다.** 요청 사이 5초 이상 쉬고,
    막히면 30초+ 쉬었다가 재시도. 세션 쿠키(목록 페이지 GET으로 받음)가 있어야 안정적.
  - ⚠️ **알뜰폰 `PLAN_PRICE`는 특가(프로모션)가 반영된 값일 수 있다** (10원짜리가 보임).
    할인 달수·이후 제값은 여기 없다 → **사업자 공시로 반드시 대조.**
  - 스크립트: `scripts/fetch-smartchoice-list.mjs` (쿠키 없이 돌리면 막힐 수 있음 — 위 참고)
  - 스냅샷: `smartchoice/sources/planlist-YYYY-MM-DD-discovery.json`
- **공개 API 있음** (`/smc/openapi/openapiguide_01.do`): 요금제 추천 API.
  회원가입 + 인증키 심사 필요 → 쓰려면 하토님 계정 필요. 지금은 안 씀(위 통로로 충분).
  쓰게 되면 「자료 출처: 스마트초이스」 표기 의무.
- 알뜰폰 포털 링크: `https://www.mvnohub.kr` (알뜰폰 허브 — 명단·가입처 확인용 후보)

## 통신 3사 공시 (값의 최종 근거)

셋 다 **목록이 자바스크립트로만 뜬다** (2026-09-01 WebFetch 확인 — 정적 HTML엔 요금제 없음).
→ 갈래는 playwright 스크립트로 렌더 후 긁는다. 세부 길은 각 계열 README에:

- SKT: `skt/README.md` — 시작점 `https://www.tworld.co.kr/web/product/plan/list`
- KT: `kt/README.md` — 시작점 `https://product.kt.com/wDic/index.do?CateCode=6002`
- LG유플러스: `lgu/README.md` — 시작점 `https://www.lguplus.com/mobile/plan/mplan/5g-all`

## 알뜰폰 사업자 (값의 최종 근거)

Task 8(명단 확정) 후 사업자마다 `data/carriers/<사업자id>/README.md`를 만든다.
