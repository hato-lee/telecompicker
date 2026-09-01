# 쿠폰팩 유심 일5GB — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDLB000328`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | 쿠폰팩 유심 일5GB |
| 머리줄(데이터) | 일5GB +일 5GB +5Mbps 무제한 |
| 망 | LG U+ 망 |
| 세대 | LTE |
| 통화 | 기본제공 |
| 문자 | 기본제공 |
| 분류 딱지 | 혜택 요금제 |
| 가격 옆 딱지 | 평생요금 |
| 월 요금 | 41,390원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "946",
 "pidx": "139",
 "paymentcode": "PDLB000328",
 "salesName": "쿠폰팩 유심 일5GB",
 "salesBadge": "C, P",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "P",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "5",
 "dedicatedOfferSumValue": "150",
 "dedicatedDataDepletionRate": "4",
 "dedicatedCallsGubun": "L",
 "dedicatedCallsValue": "",
 "dedicatedSmsGubun": "L",
 "dedicatedSmsValue": "",
 "dedicatedViedocallsGubun": "B",
 "dedicatedViedocallsValue": "300",
 "directPromotionDirectmallPrice": "41390",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "D",
 "tetheringAllowValue": "월 11GB",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 8건 — 요금이 아니라 담지 않는다)"
}
```

## 담지 않았다

- **일 단위 데이터 요금제 — 스키마에 그릇이 없다(DECIDED 2026-09-01)**
- 빠뜨린 것이 아니라 규칙상 뺀 것이다.
