# ZEM플랜 베스트 — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `skt-zem-best`
- T world 상품코드: `NA00007493`
- 상세/공시 페이지: https://www.tworld.co.kr/web/product/callplan/NA00007493
- 목록 API: https://www.tworld.co.kr/core-product/v1/product/mobile/plan-overall-list?idxCtgCd=F01100
- 연령 필터 목록 API: https://www.tworld.co.kr/core-product/v1/product/mobile/plan-filter-list?idxCtgCd=F01100&targetProdFltIds=F01166(만 12세 이하)
- 공시 API: https://www.tworld.co.kr/core-product/v1/ledger/NA00007493/summaries · .../contents
- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> 만 12세 이하 개인명의 고객님에 한하여 1인 1회선 가입 가능

→ `ageMin: null` · `ageMax: 12`

## 원문 값 (목록 API를 그대로 옮김)

| 칸 | 원문 그대로 |
|---|---|
| 요금제 이름 | ZEM플랜 베스트 |
| 월정액(basFeeInfo) | 26000원 |
| 선택약정 반영 시(selAgrmtAplyMfixAmt) | 19500원 — **담지 않는다** |
| 기본 제공 데이터(GB) | 3 |
| 소진 후 속도(qosDataQtyCtt) | 최대 400kbps |
| 음성통화(basOfrVcallTmsCtt) | 무제한 |
| 문자(basOfrCharCntCtt) | 기본 제공 |
| 영상/부가통화(addTcCtt) | 100 |
| 공유/테더링 한도(shrDataQtyCtt) | 0 |
| 목록 분류(prodFltList) | 5G, 만 12세 이하, 만 18세 이하, 2~5GB, ~3만원대, 우리 아이를 위한 주니어 요금제 |

## 우리 그릇에 담은 값

```json
{
  "id": "skt-zem-best",
  "carrier": "SK텔레콤",
  "carrierType": "mno",
  "network": "SKT",
  "name": "ZEM플랜 베스트",
  "generation": "5G",
  "monthlyFee": 26000,
  "promo": null,
  "dataGB": 3,
  "dailyDataGB": null,
  "throttleMbps": 0.4,
  "voiceMinutes": null,
  "smsIncluded": true,
  "ageMin": null,
  "ageMax": 12,
  "sourceUrl": "https://www.tworld.co.kr/web/product/callplan/NA00007493",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 「만 12세 이하 개인명의 고객님에 한하여 1인 1회선 가입 가능」 어린이(주니어) 전용. 만 14세 생일의 다음 달에 요금제 자동 변경."
}
```

## 담지 않은 값

- `selAgrmtAplyMfixAmt`(선택약정 25% 반영가) — DECIDED 2026-09-01: 공시 정가만 담는다.
- `promo`: null — 요금제 월정액을 기간 한정으로 깎아 주는 것이 원문에 없다.
