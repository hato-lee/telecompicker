# 표준요금제 — 원문에서 본 값 (2026-09-01)

- 요금제 id(우리): `skt-standard`
- T world 상품코드: `NA00002200`
- 상세/공시 페이지: https://www.tworld.co.kr/web/product/callplan/NA00002200
- 목록 API: https://www.tworld.co.kr/core-product/v1/product/mobile/plan-overall-list?idxCtgCd=F01100
- 공시 API: https://www.tworld.co.kr/core-product/v1/ledger/NA00002200/summaries · .../contents
- 확인 날짜: 2026-09-01

## 원문 값 (요약 API `summaries`를 그대로 옮김)

| 칸 | 원문 그대로 |
|---|---|
| 요금제 이름 | 표준요금제 |
| 월정액(basFeeInfo) | 12100원 |
| 선택약정 반영 시(selAgrmtAplyMfixAmt) | 9075원 — **담지 않는다** |
| 기본 제공 데이터(GB) | - |
| 기본 제공 데이터(MB) | - |
| 소진 후 속도(qosDataQtyCtt) | - |
| 음성통화(basOfrVcallTmsCtt) | - |
| 문자(basOfrCharCntCtt) | 50 |
| 영상/부가통화(addTcCtt) | - |
| 공유/테더링 한도(shrDataQtyCtt) | - |
| 목록 분류(prodFltList) | LTE, 나이 제한 없음, ~3만원대 |

## 우리 그릇에 담은 값

```json
{
  "id": "skt-standard",
  "carrier": "SK텔레콤",
  "carrierType": "mno",
  "network": "SKT",
  "name": "표준요금제",
  "generation": "LTE",
  "monthlyFee": 12100,
  "promo": null,
  "dataGB": 0,
  "throttleMbps": null,
  "voiceMinutes": 0,
  "smsIncluded": true,
  "sourceUrl": "https://www.tworld.co.kr/web/product/callplan/NA00002200",
  "checkedAt": "2026-09-01",
  "memo": "종량(從量) 기본 요금제. 원문 표: 월정액 12,100원 / 음성 \"-\" / 데이터 \"-\" / 문자 \"SMS 50건\". 음성·데이터는 쓴 만큼 과금(집·이동전화 1.98원/초, 데이터 0.275원/0.5KB)."
}
```

## 공시 본문 — 「이용 요금 및 기본 혜택」 (원문 그대로, 글자만 뽑음)

```
이용 요금 및 혜택 안내 - 월정액(부가세 포함), 음성, 데이터, 문자로 구성된 표입니다.월정액
(부가세 포함) | 음성 | 데이터 | 문자 | 


12,100원 | - | - | SMS 50건 | 



음성통화, 문자, 데이터를 사용하신 만큼 납부하는 기본 요금제입니다.

집전화 · 이동전화 이용 요금은 부가세 포함 1.98원/초 입니다.

문자 이용 요금은 부가세 포함 SMS 22원/건, LMS 33원/건, MMS 110원/건 입니다.

데이터 이용 요금은 부가세 포함 0.275원/0.5KB입니다.(1MB=1,024KB, 1GB=1,024MB) 데이터 사용을 차단하려면 무선 인터넷 차단 서비스에 별도로 가입하셔야 합니다.
```

## 공시 본문 — 가입 조건/안내

```
(별도 절 없음)
```
