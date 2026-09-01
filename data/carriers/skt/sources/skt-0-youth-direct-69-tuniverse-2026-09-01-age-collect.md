# 0 청년 다이렉트 69(T 우주) — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `skt-0-youth-direct-69-tuniverse`
- T world 상품코드: `NA00008154`
- 상세/공시 페이지: https://www.tworld.co.kr/web/product/callplan/NA00008154
- 목록 API: https://www.tworld.co.kr/core-product/v1/product/mobile/plan-overall-list?idxCtgCd=F01100
- 연령 필터 목록 API: https://www.tworld.co.kr/core-product/v1/product/mobile/plan-filter-list?idxCtgCd=F01100&targetProdFltIds=F01165(만 34세 이하)
- 공시 API: https://www.tworld.co.kr/core-product/v1/ledger/NA00008154/summaries · .../contents
- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> 5G/LTE 스마트폰을 사용하시는 만 34세 이하 고객님만 가입하실 수 있습니다.

→ `ageMin: null` · `ageMax: 34`

## 원문 값 (목록 API를 그대로 옮김)

| 칸 | 원문 그대로 |
|---|---|
| 요금제 이름 | 0 청년 다이렉트 69(T 우주) |
| 월정액(basFeeInfo) | 69000원 |
| 선택약정 반영 시(selAgrmtAplyMfixAmt) | 0원 — **담지 않는다** |
| 기본 제공 데이터(GB) | 무제한 |
| 소진 후 속도(qosDataQtyCtt) | - |
| 음성통화(basOfrVcallTmsCtt) | 무제한 |
| 문자(basOfrCharCntCtt) | 기본 제공 |
| 영상/부가통화(addTcCtt) | 300 |
| 공유/테더링 한도(shrDataQtyCtt) | 100 |
| 목록 분류(prodFltList) | 5G, 만 34세 이하, 8GB~, 6만원대~ |

## 우리 그릇에 담은 값

```json
{
  "id": "skt-0-youth-direct-69-tuniverse",
  "carrier": "SK텔레콤",
  "carrierType": "mno",
  "network": "SKT",
  "name": "0 청년 다이렉트 69(T 우주)",
  "generation": "5G",
  "monthlyFee": 69000,
  "promo": null,
  "dataGB": null,
  "dailyDataGB": null,
  "throttleMbps": null,
  "voiceMinutes": null,
  "smsIncluded": true,
  "ageMin": null,
  "ageMax": 34,
  "sourceUrl": "https://www.tworld.co.kr/web/product/callplan/NA00008154",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 「5G/LTE 스마트폰을 사용하시는 만 34세 이하 고객님만 가입하실 수 있습니다.」 0 청년 다이렉트 요금제는 T 다이렉트샵에서 스마트폰으로 신규가입/기기변경 또는 유심을 개통한 경우에만 가입하실 수 있습니다(신규가입/기기변경일 포함 15일 안에만). 라운드 1이 같은 조건의 다이렉트5G를 담았기에 같은 기준으로 담았다."
}
```

## 담지 않은 값

- `selAgrmtAplyMfixAmt`(선택약정 25% 반영가) — DECIDED 2026-09-01: 공시 정가만 담는다.
- `promo`: null — 요금제 월정액을 기간 한정으로 깎아 주는 것이 원문에 없다.
