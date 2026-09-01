# 유심 시니어 통화 데이터 넉넉히 4GB — 원문에서 본 값 (2026-09-01 확인, 라운드 2)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 유의사항 출처: `POST https://direct.lghellovision.net/phone/commNoticeNew.do` (body `paymentCode=PDLB000176&itemGubun=USIM&cpGubun=C`)
- 요금제코드: `PDLB000176`
- 확인 날짜: 2026-09-01

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "401",
 "pidx": "193",
 "paymentcode": "PDLB000176",
 "salesName": "유심 시니어 통화 데이터 넉넉히 4GB",
 "salesBadge": "",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "S",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "4",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "4",
 "dedicatedDataDepletionRate": "1",
 "dedicatedCallsGubun": "L",
 "dedicatedCallsValue": "",
 "dedicatedSmsGubun": "L",
 "dedicatedSmsValue": "",
 "dedicatedViedocallsGubun": "B",
 "dedicatedViedocallsValue": "30",
 "directPromotionDirectmallPrice": "18700",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 6건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-usim-senior-call-data-plenty-4gb-lgu",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "LGU+",
 "name": "유심 시니어 통화 데이터 넉넉히 4GB",
 "generation": "LTE",
 "monthlyFee": 18700,
 "promo": null,
 "dataGB": 4,
 "dailyDataGB": null,
 "throttleMbps": 0.4,
 "voiceMinutes": null,
 "smsIncluded": true,
 "ageMin": 65,
 "ageMax": null,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 가격 옆 표시 「평생요금」 — 이 값이 계속 내는 월정액이다(기간 한정 할인 아님). 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 연령제한 요금제 유의사항 원문 「시니어 요금제 : 만 65세 이상, 1인 1회선 한정」. 원문 요금제코드 PDLB000176."
}
```

## ⭐ 연령 제한 — 게이트 2 신규 그릇(ageMin/ageMax)

`phone/commNoticeNew.do` 유의사항 원문(연령제한 요금제 공통 안내):

> 시니어 요금제 : 만 65세 이상, 1인 1회선 한정

이 문구에서 `ageMin=65`, `ageMax=null` 로 옮겼다. 「1인 1회선 한정」은 남용 방지용 개수 제한이지 나이 외 별도 자격 조건(부모 명의·특정 기기 등)이 아니다 — 원문에 그런 조건 없음을 확인.

### 왜 이 값인가

- `monthlyFee` — 원문 가격 옆 딱지가 「평생요금」(directPromotionInfotext=A) → monthlyFee=18700, promo=null
- `dataGB`=4 / `dailyDataGB`=null / `throttleMbps`=0.4
- `voiceMinutes`=null(무제한) / `smsIncluded`=true
- `ageMin`=65 / `ageMax`=null
