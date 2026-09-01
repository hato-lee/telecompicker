# [L]그란데(100분/6GB) — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://www.eyes.co.kr/payplan/plan_info/141/C01
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | [L]그란데(100분/6GB) |
| 배지 | LGU+ · 18개월 할인 |
| 데이터 | 6GB |
| 통화 | 100분 |
| 문자 | 100건 |
| 정가(취소선) | 15,100원 |
| 표시가 | 첫 18개월간 월 10원 |

### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
| 18개월 동안 | 10원 |
| 평생 | 15,100원 |

## 스키마에 담은 값

```
id            eyes-grande-100-min-6gb-lgu
carrier       아이즈모바일 / mvno / network LGU+
generation    LTE  ← ⚠️ 원문이 세대를 말하지 않는다. 이름에 「5G」가 없어 LTE로 담음
monthlyFee    15100
promo         { months: 18, feeDuring: 10 }
dataGB        6
throttleMbps  null
voiceMinutes  100
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
