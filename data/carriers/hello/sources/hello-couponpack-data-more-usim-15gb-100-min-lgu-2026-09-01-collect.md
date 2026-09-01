# 쿠폰팩 데이터 더주는 유심 15GB 100분 — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDLB000341`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | 쿠폰팩 데이터 더주는 유심 15GB 100분 |
| 머리줄(데이터) | 15GB +3Mbps 무제한 |
| 망 | LG U+ 망 |
| 세대 | LTE |
| 통화 | 100분 |
| 문자 | 100건 |
| 분류 딱지 | 혜택 요금제 |
| 가격 옆 딱지 | 평생요금 |
| 월 요금 | 32,300원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "979",
 "pidx": "143",
 "paymentcode": "PDLB000341",
 "salesName": "쿠폰팩 데이터 더주는 유심 15GB 100분",
 "salesBadge": "C, A10, P",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "P",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "15",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "15",
 "dedicatedDataDepletionRate": "3",
 "dedicatedCallsGubun": "B",
 "dedicatedCallsValue": "100",
 "dedicatedSmsGubun": "B",
 "dedicatedSmsValue": "100",
 "dedicatedViedocallsGubun": "N",
 "dedicatedViedocallsValue": "",
 "directPromotionDirectmallPrice": "32300",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "LG U+망 1회선 통화 무제한",
 "benefitList": "(사은품 9건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-couponpack-data-more-usim-15gb-100-min-lgu",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "LGU+",
 "name": "쿠폰팩 데이터 더주는 유심 15GB 100분",
 "generation": "LTE",
 "monthlyFee": 32300,
 "promo": null,
 "dataGB": 15,
 "throttleMbps": 3,
 "voiceMinutes": 100,
 "smsIncluded": true,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 가격 옆 표시 「평생요금」 — 이 값이 계속 내는 월정액이다(기간 한정 할인 아님). 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 원문 분류 딱지 「혜택 요금제」. 원문 딱지 「U+결합할인」 대상 — 결합할인 값은 이번 범위 밖이라 담지 않았다. 원문 요금제코드 PDLB000341."
}
```

### 왜 이 값인가

- `monthlyFee` 32,300원 — 원문 가격 옆 딱지가 「평생요금」이다. 기간 한정 할인이 아니라 계속 내는 값이므로 `promo`는 `null`.
- `dataGB` 15 / `throttleMbps` 3
- `voiceMinutes` 100 / `smsIncluded` true
- ⚠️ 원문 딱지 「U+결합할인」 대상. 결합할인 금액은 이번 범위 밖(DECIDED)이라 담지 않았다.
