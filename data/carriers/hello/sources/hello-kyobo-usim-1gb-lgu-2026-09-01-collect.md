# 교보문고 유심 1GB — 원문에서 본 값 (2026-09-01 확인)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 요금제코드: `PDLB000409`
- 확인 날짜: 2026-09-01

## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)

| 칸 | 원문 |
|---|---|
| 요금제명 | 교보문고 유심 1GB |
| 머리줄(데이터) | 1GB +1Mbps 무제한 |
| 망 | LG U+ 망 |
| 세대 | LTE |
| 통화 | 기본제공 |
| 문자 | 기본제공 |
| 분류 딱지 | 혜택 요금제 |
| 가격 옆 딱지 | 7개월 후 12,850원 |
| 월 요금 | 8,800원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "1280",
 "pidx": "139",
 "paymentcode": "PDLB000409",
 "salesName": "교보문고 유심 1GB",
 "salesBadge": "N, MI",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "교보문고",
 "salesBadgeTextColor": "9df743",
 "salesBadgeBgColor": "0e0f37",
 "dedicatedPriceGubun": "P",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "1",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "1",
 "dedicatedDataDepletionRate": "2",
 "dedicatedCallsGubun": "L",
 "dedicatedCallsValue": "",
 "dedicatedSmsGubun": "L",
 "dedicatedSmsValue": "",
 "dedicatedViedocallsGubun": "B",
 "dedicatedViedocallsValue": "110",
 "directPromotionDirectmallPrice": "8800",
 "directPromotionInfotext": "P",
 "directPromotionAfterMonthChk": "7",
 "directPromotionAfterPrice": "12850",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 6건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-kyobo-usim-1gb-lgu",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "LGU+",
 "name": "교보문고 유심 1GB",
 "generation": "LTE",
 "monthlyFee": 12850,
 "promo": {
  "months": 7,
  "feeDuring": 8800,
  "note": "원문 표시 「7개월 후 12,850원」"
 },
 "dataGB": 1,
 "throttleMbps": 1,
 "voiceMinutes": null,
 "smsIncluded": true,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 유의사항 「7개월간 추가할인 프로모션이 적용될 경우, 신규가입에 한 해 적용되며 요금제 변경 시 제외됩니다.」 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 원문 분류 딱지 「혜택 요금제」. 영상·부가통화 110분(스키마에 그릇 없음). 원문 요금제코드 PDLB000409."
}
```

### 왜 이 값인가

- `monthlyFee` 12,850원 / `promo` 7개월 8,800원 — 원문 가격 옆 딱지가 「7개월 후 12,850원」이고 큰 숫자가 8,800원이다. 즉 앞 7달은 할인가, 그 뒤가 제값.
- `dataGB` 1 / `throttleMbps` 1
- `voiceMinutes` null (기본제공=무제한) / `smsIncluded` true
