# DATA 걱정없는 유심 일5GB — 원문에서 본 값 (2026-09-01 확인, 라운드 2)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 유의사항 출처: `POST https://direct.lghellovision.net/phone/commNoticeNew.do` (body `paymentCode=PDLB000122&itemGubun=USIM&cpGubun=C`)
- 요금제코드: `PDLB000122`
- 확인 날짜: 2026-09-01

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "356",
 "pidx": "139",
 "paymentcode": "PDLB000122",
 "salesName": "DATA 걱정없는 유심 일5GB",
 "salesBadge": "C",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "N",
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
 "directPromotionDirectmallPrice": "38990",
 "directPromotionInfotext": "A",
 "directPromotionAfterMonthChk": "",
 "directPromotionAfterPrice": "",
 "tetheringAllowGb": "D",
 "tetheringAllowValue": "월 11GB",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 6건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-data-worryfree-usim-daily-5gb-lgu",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "LGU+",
 "name": "DATA 걱정없는 유심 일5GB",
 "generation": "LTE",
 "monthlyFee": 38990,
 "promo": null,
 "dataGB": 0,
 "dailyDataGB": 5,
 "throttleMbps": 5,
 "voiceMinutes": null,
 "smsIncluded": true,
 "ageMin": null,
 "ageMax": null,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 가격 옆 표시 「평생요금」 — 이 값이 계속 내는 월정액이다(기간 한정 할인 아님). 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 원문 머리줄 「일5GB」 — 월 기본제공량은 없고 매일 5GB만 준다(dataGB=0, dailyDataGB=5). 원문 딱지 「U+결합할인」 대상 — 결합할인 값은 이번 범위 밖이라 담지 않았다. 원문 요금제코드 PDLB000122."
}
```

## ⭐ 일 단위 데이터 — 게이트 2 신규 그릇(dailyDataGB)

원문 `dedicatedMonthlyOfferValue`가 빈칸이고 `dedicatedDailyOfferValue=5`(G) — 월 기본제공량 없이 매일 5GB만 준다. 라운드 1(2026-09-01)에서는 이 그릇이 없어 뺐던 항목이다. `dataGB=0`, `dailyDataGB=5`로 담았다.

### 왜 이 값인가

- `monthlyFee` — 원문 가격 옆 딱지가 「평생요금」(directPromotionInfotext=A) → monthlyFee=38990, promo=null
- `dataGB`=0 / `dailyDataGB`=5 / `throttleMbps`=5
- `voiceMinutes`=null(무제한) / `smsIncluded`=true
- `ageMin`=null / `ageMax`=null
