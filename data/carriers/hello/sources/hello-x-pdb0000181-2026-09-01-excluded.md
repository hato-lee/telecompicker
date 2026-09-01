# 데이터플러스 10GB — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: KT 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDB0000181`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | 데이터플러스 10GB |
| 머리줄(데이터) | 10GB |
| 망 | KT 망 |
| 세대 | LTE |
| 통화 | 0분 |
| 문자 | 0건 |
| 분류 딱지 | 패드 |
| 가격 옆 딱지 | 평생요금 |
| 월 요금 | 10,780원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "196",
 "pidx": "85",
 "paymentcode": "PDB0000181",
 "salesName": "데이터플러스 10GB",
 "salesBadge": "B",
 "telecom": "KT",
 "title": "LTE USIM 패드 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "T",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "10",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "10",
 "dedicatedDataDepletionRate": "0",
 "dedicatedCallsGubun": "B",
 "dedicatedCallsValue": "0",
 "dedicatedSmsGubun": "B",
 "dedicatedSmsValue": "0",
 "dedicatedViedocallsGubun": "N",
 "dedicatedViedocallsValue": "",
 "directPromotionDirectmallPrice": "10780",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 0건 — 요금이 아니라 담지 않는다)"
}
```

## 담지 않았다

- **패드(태블릿) 요금제 — 휴대폰 요금제가 아니다**
- 빠뜨린 것이 아니라 규칙상 뺀 것이다.
