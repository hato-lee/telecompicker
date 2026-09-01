# 데이터 맘껏 15GB+/300분(올리브영 5000P) — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세 팝업): https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=12&rateAdsvcGdncSeq=487&rateAdsvcCd=PL2543139
- 목록 출처: `POST https://www.ktmmobile.com/rate/rateContentAjax.do` body `rateAdsvcCtgCd=12` (그룹: 「데이터 맘껏」)
- 상세 출처: `GET https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=12&rateAdsvcGdncSeq=487&rateAdsvcCd=PL2543139` (요금제 코드 PL2543139)

## 원문 표에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제명 | 데이터 맘껏 15GB+/300분(올리브영 5000P) |
| 월 기본료(정가, mmBasAmtVatDesc) | 60,500원 |
| 프로모션 요금(promotionAmtVatDesc) | 29,800원 — 상세 팝업 본문에 할인 적용 기간(「N개월」·「평생」·「무약정」) 문구 없음. 고객 후기란에만 산발적 언급이 있으나 원문(사업자 공식 설명)이 아니라 근거로 쓰지 않음 |
| 데이터 | 15GB+최대3Mbps |
| 음성 | 300분 |
| 문자 | 300건 |

## 스키마에 담은 값

```
id            ktm-data-mamkkeot-15gb-300m-oliveyoung
carrier       kt엠모바일 / mvno / network KT
generation    LTE  (원문 카테고리 분류 그대로: 데이터 맘껏)
monthlyFee    29800  ← 프로모션 요금(상세 팝업 「프로모션 요금(VAT 포함)」). 정가 60500는 memo에만 인용
promo         null  (기간제 할인이 아니라 「실제 개통 시점 판매가」 구조 — promo{months,...} 그릇이 안 맞아 monthlyFee에 판매가를 직접 담음)
dataGB        15
throttleMbps  3.0
voiceMinutes  300
smsIncluded   true
```

## ⚠️ 값 필드 4개 함정 — 판정 근거

- 원문 4필드: mmBasAmtDesc=60,500 / mmBasAmtVatDesc=60,500 / promotionAmtDesc=29,800 / promotionAmtVatDesc=29,800
- 실판매가로 보이는 promotionAmtVatDesc(29,800원)를 `monthlyFee`에 담지 않았다 — 상세 팝업(rateLayer.do) 원문 전체를 훑어도 할인 적용 개월수나 「평생/무약정 할인」 명시가 없다(`usePrd`도 0으로만 관측). 규칙에 따라 정가(mmBasAmtVatDesc)를 담고 memo에 할인가를 인용만 했다.

## 제휴 혜택

- 올리브영 모바일상품권 포인트 혜택 포함

## 2026-09-01 총괄 판정 갱신 — monthlyFee를 프로모션 요금으로

상세 팝업(rateLayer.do) 유의사항 원문: 「요금제의 월정액은 실제 개통 시점의 판매가로 적용되며, 당사 정책에 의해 상시 변동 될 수 있습니다.」
→ 프로모션 요금(VAT 포함) 29,800원이 가입자가 실제 내는 월정액이라는 뜻으로 총괄이 판정.
이전 판정(할인 기간 불명이라 정가 60,500원을 담음)을 뒤집고 `monthlyFee=29800`로 갱신했다.
정가 60,500원은 memo에 인용만 남겼다. `promo{months,...}`는 여전히 담지 않는다 — 이건 「N개월 할인」이 아니라 언제든 바뀔 수 있는 상시 판매가라서 기간 필드 자체가 안 맞는다.
