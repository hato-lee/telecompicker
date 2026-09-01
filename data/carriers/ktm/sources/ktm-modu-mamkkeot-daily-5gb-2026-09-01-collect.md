# 모두다 맘껏 일 5GB+ — 원문에서 본 값 (2026-09-01 확인, 라운드 2)

- 원문(상세 팝업): https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=9&rateAdsvcGdncSeq=420&rateAdsvcCd=PL242G635
- 목록 출처: `POST https://www.ktmmobile.com/rate/rateContentAjax.do` body `rateAdsvcCtgCd=9` (그룹: 「모두다 맘껏」)
- 요금제 코드: PL242G635

## 원문 표에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제명 | 모두다 맘껏 일 5GB+ |
| 월 기본료(정가, mmBasAmtVatDesc) | 66,000원 |
| 프로모션 요금(상세 팝업 「프로모션 요금 (VAT 포함)」) | 38,200원 |
| 데이터 | 일5GB+최대5Mbps |
| 음성 | 기본제공 |
| 문자 | 기본제공 |

## 스키마에 담은 값

```json
{
 "id": "ktm-modu-mamkkeot-daily-5gb",
 "carrier": "kt엠모바일",
 "carrierType": "mvno",
 "network": "KT",
 "name": "모두다 맘껏 일 5GB+",
 "generation": "LTE",
 "monthlyFee": 38200,
 "promo": null,
 "dataGB": 0,
 "dailyDataGB": 5,
 "throttleMbps": 5,
 "voiceMinutes": null,
 "smsIncluded": true,
 "ageMin": null,
 "ageMax": null,
 "sourceUrl": "https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=9&rateAdsvcGdncSeq=420&rateAdsvcCd=PL242G635",
 "checkedAt": "2026-09-01",
 "memo": "정가 66,000원, 프로모션 요금 38,200원 — 「월정액은 실제 개통 시점의 판매가로 적용」(상세 유의사항). 상시 변동 가능. 원문 데이터 표기 「일5GB+최대5Mbps」 — 월 기본 제공량은 없고 매일 5GB만 준다(dataGB=0, dailyDataGB=5)."
}
```

## ⭐ 일 단위 데이터 — 게이트 2 신규 그릇(dailyDataGB)

원문 데이터 표기 「일5GB+최대5Mbps」를 `dataGB`(월 기본)와 `dailyDataGB`(매일 추가/전용)로 나눠 담았다. 라운드 1(2026-09-01)에서는 이 그릇이 없어 뺐던 항목이다.

## 값 판정 근거

- 상세 팝업 유의사항 「요금제의 월정액은 실제 개통 시점의 판매가로 적용되며, 당사 정책에 의해 상시 변동 될 수 있습니다.」에 근거해 `monthlyFee`는 프로모션 요금(VAT 포함)을 담았다. 정가는 memo에만 인용. `promo`는 담지 않는다(기간제 할인이 아니라 상시 변동 판매가).
