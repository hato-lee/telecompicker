# 모빙 (유니컴즈) — 길 지도

수집 갈래가 2026-09-01 뚫음. 독립 알뜰폰, 3망(SKT·KT·LGU+).
공식 사이트: **https://www.mobing.co.kr** (첫 화면 스크립트에 `siteName: '(주)유니컴즈'`가 박혀 있어 공식으로 확인했다.)
화면은 **Vue SPA**라 curl로 받은 HTML은 껍데기(3KB)다. 값은 전부 아래 API에 있다.

## 통로 (내부 API — 세션·쿠키 없이 동작 확인)

1. **목록**: `POST https://www.mobing.co.kr/api/product/getV2PlanList`
   - `Content-Type: application/json`, 본문 `{"page":1,"limit":9999,"telco":[]}`
   - 한 번에 226건 전부 온다. `entity.list` / `entity.pageInfo`.
2. **상세**: `GET https://www.mobing.co.kr/api/product/getPlanInfo?planID=<planID>&promoSeq=<promoSeq>`
   - ⚠️ **`promoSeq`를 빼면 할인이 통째로 사라진 정가 응답이 온다.** 목록의 `promoSeq`를 같이 넘겨야
     `promoSaleList`(할인 내역)와 `totalAmountMon`(실판매가)이 채워진다.
   - 여기에만 있는 값: **`networkID`(`4G`/`5G`)** — 목록에는 세대 필드가 없다. 이름의 「5G」로 넘겨짚지 말 것.
   - `contents`에 유의사항 원문이 HTML로 들어 있다.

API 경로 목록은 `/js/app.<hash>.js`(2.6MB)에 문자열로 다 들어 있다. 해시는 첫 HTML의 `<script src>`에서 얻는다.

## 값 필드 — ⚠️ 함정

- 요금이 **네 층**이다: `originAmountMon`(정가) − `ltSaleAmount` − `prSaleAmount` = `amountMon`(지금 내는 값).
  실측 226건 전부 이 식이 딱 맞는다.
- **기간은 `termAll` / `termShort`가 말해 준다.**
  - `termAll = 1200`(=100년) → 사실상 **평생 할인**. 상세의 `promoSaleList[].saleList`에 `termMonth:"1200"`으로 들어 있고,
    목록의 `desc01`이 그런 요금제 24건에 **「평생 할인 요금제」**라고 그대로 적혀 있다. → 정가에 반영한다.
  - `termShort`(5·6·7·8·10·12·20·24) → **N개월 특가**. `desc01`이 「초특가 요금제」인 15건이 전부 여기 걸린다.
  - 그래서 우리 규칙: `monthlyFee = originAmountMon − ltSaleAmount`,
    `promo = termShort ? {months: termShort, feeDuring: amountMon} : null`.
  - 분포(226건): 할인 없음 61 · 평생만 39 · 특가만 56 · 평생+특가 70.
- **부가세 포함가**다(49,500 = 45,000 × 1.1).
- 유의사항 원문: 「요금제의 프로모션 할인요금은 모빙 **신규고객(신규가입/번호이동)** 대상으로만 진행됩니다.
  기고객의 경우 … 할인 전 기본요금으로 변경만 가능합니다.」 → memo에 남겼다.
- 데이터: `basicDataMon` + `basicDataMonUnit`(`GB`/`MB`). **「무제한」 표기는 없다** — 전부 기본량(+속도제어)이다.
- 속도제어: `qosFlag='Y'`일 때 `basicQos` + `basicQosUnit`(`Mbps`/`Kbps`/`MBPS` — 대소문자가 섞여 있다).
- **일 단위 데이터**: `dayDataFlag='Y'`(22건) / `dailyQos`(`+ 매일2GB`) / `basicDataDay`. DECIDED에 따라 안 담았다.
- 통화 `basicVoice` = `기본제공`(무제한) 또는 `N분`(`0분` 있음). 문자 `basicSms` = `기본제공` 또는 `N건`.
- `serviceType`은 226건 모두 `"2"` — 이 목록에는 워치·태블릿이 섞여 있지 않다.

## 상세(원문) 페이지 — 배지에 쓸 주소

`https://www.mobing.co.kr/product/plan/view?planID=<planID>&promoSeq=<promoSeq>`
(SPA 라우트. `app.js`의 `path:"/product/plan/view"`와 상세 컴포넌트가 `$route.query`를 그대로 API에 넘기는 것으로 확인.)

## 담지 않은 것 (2026-09-01, DECIDED 기준)

| 무엇 | 개수 | 고른 방법 |
|---|---|---|
| 일 단위 데이터 | 22 | `dayDataFlag='Y'` 또는 `dailyQos` 있음 |
| 가입 대상 제한(청소년·시니어·복지·주니어) | 14 | 이름 검사 |

226건 중 **190건**을 담았다.

## 뒤진 곳

- 첫 HTML `/` — 2,996바이트, `<div id=app>`뿐.
- `/js/app.<hash>.js` — API 경로·호출 파라미터가 전부 여기 있다(`getV2PlanList`, `getPlanInfo`, `getPlanGroupList` …).
- `/api/product/getPlanGroupList`(요금제 그룹)·`/api/product/getPromoPlanList`는 이번에 안 썼다 — 목록 하나로 충분했다.
