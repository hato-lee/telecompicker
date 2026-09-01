# 5G 라이트 110GB (KT 망) — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://tossmobile.co.kr/pricing/KT_5G_110GB?carrier=KT
- 목록: https://tossmobile.co.kr/pricing — 「KT 망」 탭 > 「5G 라이트 요금제」
- 값의 출처: 목록·상세를 브라우저로 띄워 눈으로 읽은 값 + 그 화면이 부르는 내부 통로
  `GET https://api-public.toss.im/api/v3/mvno-growth/products/homepage` (planCode `KT_5G_110GB`)

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | 5G 라이트 110GB |
| 망·세대 | KT / 5G |
| 요금 | 7개월 동안 월 27,800원, 그 뒤 49,800원 |
| 데이터 | 110GB + 5Mbps (상세 「다 써도 5Mbps 속도」) |
| 통화 | 무제한 (영상 부가 통화 300분) |
| 문자 | 무제한 |
| 핫스팟 | 40GB |
| 할인 마감 | 상세 「할인 혜택은 9월 1일 오후 8시 0분까지 가입해야 받을 수 있어요」 (통로 applyEndTs 2026-09-01T20:00:00) |

## 스키마에 담은 값

```
id            toss-5g-lite-110gb-kt
carrier       토스모바일 / mvno / network KT
generation    5G
monthlyFee    49800
promo         { months: 7, feeDuring: 27800 }
dataGB        110
throttleMbps  5
voiceMinutes  null (무제한)
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(캐시백·CU 20% 할인·페이스페이 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 부가세 포함 여부를 원문이 말하지 않는다 — 화면 표시가를 그대로 담았다.
