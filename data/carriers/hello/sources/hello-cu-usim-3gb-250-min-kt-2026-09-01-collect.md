# CU USIM 3GB 250분 — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: KT 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDB0000216`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | CU USIM 3GB 250분 |
| 머리줄(데이터) | 3GB |
| 망 | KT 망 |
| 세대 | LTE |
| 통화 | 250분 |
| 문자 | 250건 |
| 분류 딱지 | (없음) |
| 가격 옆 딱지 | 평생요금 |
| 월 요금 | 10,230원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "206",
 "pidx": "93",
 "paymentcode": "PDB0000216",
 "salesName": "CU USIM 3GB 250분",
 "salesBadge": "",
 "telecom": "KT",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "N",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "3",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "3",
 "dedicatedDataDepletionRate": "0",
 "dedicatedCallsGubun": "B",
 "dedicatedCallsValue": "250",
 "dedicatedSmsGubun": "B",
 "dedicatedSmsValue": "250",
 "dedicatedViedocallsGubun": "N",
 "dedicatedViedocallsValue": "",
 "directPromotionDirectmallPrice": "10230",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 0건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-cu-usim-3gb-250-min-kt",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "KT",
 "name": "CU USIM 3GB 250분",
 "generation": "LTE",
 "monthlyFee": 10230,
 "promo": null,
 "dataGB": 3,
 "throttleMbps": null,
 "voiceMinutes": 250,
 "smsIncluded": true,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 가격 옆 표시 「평생요금」 — 이 값이 계속 내는 월정액이다(기간 한정 할인 아님). 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 원문 요금제코드 PDB0000216."
}
```

### 왜 이 값인가

- `monthlyFee` 10,230원 — 원문 가격 옆 딱지가 「평생요금」이다. 기간 한정 할인이 아니라 계속 내는 값이므로 `promo`는 `null`.
- `dataGB` 3 / `throttleMbps` null (소진 후 제공 없음)
- `voiceMinutes` 250 / `smsIncluded` true
