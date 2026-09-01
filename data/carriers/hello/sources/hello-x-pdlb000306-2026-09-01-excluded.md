# 청소년 안심유심 1GB 100분 — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDLB000306`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | 청소년 안심유심 1GB 100분 |
| 머리줄(데이터) | 1GB +1Mbps 무제한 |
| 망 | LG U+ 망 |
| 세대 | LTE |
| 통화 | 100분 |
| 문자 | 100건 |
| 분류 딱지 | 청소년 |
| 가격 옆 딱지 | 평생요금 |
| 월 요금 | 7,500원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "845",
 "pidx": "193",
 "paymentcode": "PDLB000306",
 "salesName": "청소년 안심유심 1GB 100분",
 "salesBadge": "N",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "J",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "1",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "1",
 "dedicatedDataDepletionRate": "2",
 "dedicatedCallsGubun": "B",
 "dedicatedCallsValue": "100",
 "dedicatedSmsGubun": "B",
 "dedicatedSmsValue": "100",
 "dedicatedViedocallsGubun": "N",
 "dedicatedViedocallsValue": "",
 "directPromotionDirectmallPrice": "7500",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 4건 — 요금이 아니라 담지 않는다)"
}
```

## 담지 않았다

- **청소년·키즈 전용 — 나이 자격 제한**
- 빠뜨린 것이 아니라 규칙상 뺀 것이다.
