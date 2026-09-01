# 청소년 안심유심 5GB — 원문에서 본 값 (2026-09-01 확인, 라운드 2)

- 원문 화면: <https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U> · 「유심 요금제」 목록 (망 고르개: LG U+ 망)
- 값의 출처: `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄
- 유의사항 출처: `POST https://direct.lghellovision.net/phone/commNoticeNew.do` (body `paymentCode=PDLB000382&itemGubun=USIM&cpGubun=C`)
- 요금제코드: `PDLB000382`
- 확인 날짜: 2026-09-01

## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)

```json
{
 "idx": "1120",
 "pidx": "193",
 "paymentcode": "PDLB000382",
 "salesName": "청소년 안심유심 5GB",
 "salesBadge": "N",
 "telecom": "LGU",
 "title": "LTE USIM 요금제",
 "usimType": "LTE",
 "salesBadgeNm": "",
 "salesBadgeTextColor": "",
 "salesBadgeBgColor": "",
 "dedicatedPriceGubun": "J",
 "dedicatedMonthlyOfferGubun": "G",
 "dedicatedMonthlyOfferValue": "5",
 "dedicatedDailyOfferGubun": "G",
 "dedicatedDailyOfferValue": "",
 "dedicatedOfferSumValue": "5",
 "dedicatedDataDepletionRate": "2",
 "dedicatedCallsGubun": "L",
 "dedicatedCallsValue": "",
 "dedicatedSmsGubun": "L",
 "dedicatedSmsValue": "",
 "dedicatedViedocallsGubun": "B",
 "dedicatedViedocallsValue": "300",
 "directPromotionDirectmallPrice": "7900",
 "directPromotionInfotext": "P",
 "directPromotionAfterMonthChk": "7",
 "directPromotionAfterPrice": "13400",
 "tetheringAllowGb": "S",
 "tetheringAllowValue": "",
 "voiceDetailSpec": "",
 "benefitList": "(사은품 4건 — 요금이 아니라 담지 않는다)"
}
```

## 스키마에 담은 값 (src/data/plans/hello.json)

```json
{
 "id": "hello-teen-ansim-usim-5gb-lgu",
 "carrier": "헬로모바일",
 "carrierType": "mvno",
 "network": "LGU+",
 "name": "청소년 안심유심 5GB",
 "generation": "LTE",
 "monthlyFee": 13400,
 "promo": {
  "months": 7,
  "feeDuring": 7900,
  "note": "원문 표시 「7개월 후 13,400원」"
 },
 "dataGB": 5,
 "dailyDataGB": null,
 "throttleMbps": 1,
 "voiceMinutes": null,
 "smsIncluded": true,
 "ageMin": 4,
 "ageMax": 18,
 "sourceUrl": "https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U",
 "checkedAt": "2026-09-01",
 "memo": "원문 유의사항 「7개월간 추가할인 프로모션이 적용될 경우, 신규가입에 한 해 적용되며 요금제 변경 시 제외됩니다.」 부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」. 연령제한 요금제 유의사항 원문 「청소년 요금제 : 만 4세~만 18세 이하, 1인 1회선 한정」. 원문 요금제코드 PDLB000382."
}
```

## ⭐ 연령 제한 — 게이트 2 신규 그릇(ageMin/ageMax)

`phone/commNoticeNew.do` 유의사항 원문(연령제한 요금제 공통 안내):

> 청소년 요금제 : 만 4세~만 18세 이하, 1인 1회선 한정

이 문구에서 `ageMin=4`, `ageMax=18` 로 옮겼다. 「1인 1회선 한정」은 남용 방지용 개수 제한이지 나이 외 별도 자격 조건(부모 명의·특정 기기 등)이 아니다 — 원문에 그런 조건 없음을 확인.

### 왜 이 값인가

- `monthlyFee` — 원문 가격 딱지가 「N개월 후 M원」(directPromotionInfotext≠A) → promo{months:7, feeDuring:7900}, monthlyFee=13400(할인 끝난 뒤 값)
- `dataGB`=5 / `dailyDataGB`=null / `throttleMbps`=1
- `voiceMinutes`=null(무제한) / `smsIncluded`=true
- `ageMin`=4 / `ageMax`=18
