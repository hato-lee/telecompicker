# 아이즈포스트(500분/5G) — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://www.eyes.co.kr/payplan/plan_info/55/C01
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | 아이즈포스트(500분/5G) |
| 배지 | SKT |
| 데이터 | 5GB |
| 통화 | 500분 |
| 문자 | 500건 |
| 정가(취소선) | 없음 |
| 표시가 | 월 9,900원 |

### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
| (할인 표시 없음) | — |

## 스키마에 담은 값

```
id            eyes-eyes-post-500-min-5g-skt
carrier       아이즈모바일 / mvno / network SKT
generation    LTE  ← ⚠️ 원문이 세대를 말하지 않는다. 이름에 「5G」가 없어 LTE로 담음
monthlyFee    9900
promo         null
dataGB        5
throttleMbps  null
voiceMinutes  500
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
