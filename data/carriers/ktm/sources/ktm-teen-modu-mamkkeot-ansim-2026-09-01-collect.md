# 청소년 모두다 맘껏 안심+ — 원문에서 본 값 (2026-09-01 확인, 라운드 2)

- 원문(상세 팝업): https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=18&rateAdsvcGdncSeq=457&rateAdsvcCd=PL24BR138
- 목록 출처: `POST https://www.ktmmobile.com/rate/rateContentAjax.do` body `rateAdsvcCtgCd=18` (그룹: 「청소년 전용 요금제」)
- 요금제 코드: PL24BR138

## 원문 표에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제명 | 청소년 모두다 맘껏 안심+ |
| 월 기본료(정가, mmBasAmtVatDesc) | 20,900원 |
| 프로모션 요금(상세 팝업 「프로모션 요금 (VAT 포함)」) | 5,900원 |
| 데이터 | 0GB + 최대 400Kbps |
| 음성 | 기본제공 |
| 문자 | 기본제공 |

## 스키마에 담은 값

```json
{
 "id": "ktm-teen-modu-mamkkeot-ansim",
 "carrier": "kt엠모바일",
 "carrierType": "mvno",
 "network": "KT",
 "name": "청소년 모두다 맘껏 안심+",
 "generation": "LTE",
 "monthlyFee": 5900,
 "promo": null,
 "dataGB": 0,
 "dailyDataGB": null,
 "throttleMbps": 0.4,
 "voiceMinutes": null,
 "smsIncluded": true,
 "ageMin": null,
 "ageMax": 19,
 "sourceUrl": "https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=18&rateAdsvcGdncSeq=457&rateAdsvcCd=PL24BR138",
 "checkedAt": "2026-09-01",
 "memo": "정가 20,900원, 프로모션 요금 5,900원 — 「월정액은 실제 개통 시점의 판매가로 적용」(상세 유의사항). 상시 변동 가능. 상세 팝업 원문 「만 19세 미만 개인 고객만 가입 가능한 청소년 전용 요금제(만 19세가 되는 날의 익월 1일 '모두다 맘껏 안심+' 요금제로 자동 전환)」."
}
```

## ⭐ 연령 제한 — 게이트 2 신규 그릇(ageMin/ageMax)

상세 팝업(rateLayer.do) 원문 문구를 그대로 인용:

> 만 19세 미만 개인 고객만 가입 가능한 청소년 전용 요금제(만 19세가 되는 날의 익월 1일 '모두다 맘껏 안심+' 요금제로 자동 전환)

이 문구에서 `ageMin=null`, `ageMax=19` 로 옮겼다. 나이 외 다른 조건(부모 명의·특정 기기 등)은 원문에 없다 — 확인 완료.

## 값 판정 근거

- 상세 팝업 유의사항 「요금제의 월정액은 실제 개통 시점의 판매가로 적용되며, 당사 정책에 의해 상시 변동 될 수 있습니다.」에 근거해 `monthlyFee`는 프로모션 요금(VAT 포함)을 담았다. 정가는 memo에만 인용. `promo`는 담지 않는다(기간제 할인이 아니라 상시 변동 판매가).
