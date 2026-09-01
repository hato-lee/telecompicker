# The 착한 데이터 유심 1.3GB — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDLB000037`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | The 착한 데이터 유심 1.3GB |
| 머리줄(데이터) | 1.3GB |
| 망 | LG U+ 망 |
| 세대 | LTE |
| 통화 | 기본제공 |
| 문자 | 기본제공 |
| 분류 딱지 | (없음) |
| 가격 옆 딱지 | 평생요금 |
| 월 요금 | 6,300원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "298",
 "pidx": "140",
 "paymentcode": "PDLB000037",
 "salesName": "The 착한 데이터 유심 1.3GB",
 "salesBadge": "B",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "N",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "1.3",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "1.3",
 "dedicatedDataDepletionRate": "0",
 "dedicatedCallsGubun": "L",
 "dedicatedCallsValue": "",
 "dedicatedSmsGubun": "L",
 "dedicatedSmsValue": "",
 "dedicatedViedocallsGubun": "B",
 "dedicatedViedocallsValue": "50",
 "directPromotionDirectmallPrice": "6300",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 4건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-the-chakhan-data-usim-1-3gb-lgu",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "LGU+",
 "name": "The 착한 데이터 유심 1.3GB",
 "generation": "LTE",
 "monthlyFee": 6300,
 "promo": null,
 "dataGB": 1.3,
 "throttleMbps": null,
 "voiceMinutes": null,
 "smsIncluded": true,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 가격 옆 표시 「평생요금」 — 이 값이 계속 내는 월정액이다(기간 한정 할인 아님). 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 영상·부가통화 50분(스키마에 그릇 없음). 원문 요금제코드 PDLB000037."
}
```

### 왜 이 값인가

- `monthlyFee` 6,300원 — 원문 가격 옆 딱지가 「평생요금」이다. 기간 한정 할인이 아니라 계속 내는 값이므로 `promo`는 `null`.
- `dataGB` 1.3 / `throttleMbps` null (소진 후 제공 없음)
- `voiceMinutes` null (기본제공=무제한) / `smsIncluded` true
