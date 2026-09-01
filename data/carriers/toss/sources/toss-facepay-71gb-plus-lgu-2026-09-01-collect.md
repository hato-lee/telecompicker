# 페이스페이 71GB+ (LGU 망) — 원문에서 본 값 (2026-09-01 확인, 라운드 2 — 일 단위 데이터)

- 원문(상세): https://tossmobile.co.kr/pricing/LPZ7101276?carrier=LGU
- 목록: https://tossmobile.co.kr/pricing — 「LG U+ 망」 탭
- 값의 출처: 내부 통로 `GET https://api-public.toss.im/api/v3/mvno-growth/products/homepage`
  (planCode `LPZ7101276`) — 라운드 2 재확인 시점(2026-09-01 15:45 KST)까지 discountPolicyList 변동 없음.

## ⚠️ 화면 공시 vs 내부 통로 (함정)

- **화면(소비자가 보는 값)**: 「71GB + 3Mbps」 — 월 환산 최대치로만 적혀 있다.
  「일 2GB」라는 말은 화면 어디에도 없다.
- **내부 통로(dataUsage)**: `type: DAILY_EXTRA`, `basicAmount: 11`, `dailyAmount: 2`,
  `maximumAmount: 71` — 기본 11GB + 매일 2GB로 쪼개져 있다.
- 이 스냅샷은 **내부 통로의 쪼갬을 dataGB/dailyDataGB에 담고, 화면 공시 값은 memo에 인용**하는 라운드 2 지시를 따랐다.

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | 페이스페이 71GB+ |
| 망·세대 | LGU / LTE |
| 요금 | 7개월 동안 월 9,900원, 그 뒤 38,800원 |
| 데이터(화면 공시) | 71GB + 3Mbps |
| 데이터(내부 통로 쪼갬) | 기본 11GB + 매일 2GB |
| 통화 | 무제한 (영상 부가 통화 300분) |
| 문자 | 무제한 |
| 할인 마감 | 상세 「할인 혜택은 9월 1일 오후 8시 0분까지 가입해야 받을 수 있어요」 (통로 applyEndTs 2026-09-01T20:00:00) |

## 스키마에 담은 값

```
id            toss-facepay-71gb-plus-lgu
carrier       토스모바일 / mvno / network LGU+
generation    LTE
monthlyFee    38800
promo         { months: 7, feeDuring: 9900 }
dataGB        11
dailyDataGB   2
throttleMbps  3
voiceMinutes  null (무제한)
smsIncluded   true
ageMin        null
ageMax        null
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(캐시백·CU 20% 할인·페이스페이 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 부가세 포함 여부를 원문이 말하지 않는다 — 화면 표시가를 그대로 담았다.
