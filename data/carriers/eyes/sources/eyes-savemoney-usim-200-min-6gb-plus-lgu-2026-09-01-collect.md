# 세이브머니유심(200분/6GB+) — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://www.eyes.co.kr/payplan/plan_info/212/C01
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | 세이브머니유심(200분/6GB+) |
| 배지 | LGU+ · 평생할인 |
| 데이터 | 6GB + 1Mbps |
| 통화 | 200분 |
| 문자 | 100건 |
| 정가(취소선) | 14,960원 |
| 표시가 | 평생 월 4,400원 |

### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
| 평생 | 4,400원 |

## 스키마에 담은 값

```
id            eyes-savemoney-usim-200-min-6gb-plus-lgu
carrier       아이즈모바일 / mvno / network LGU+
generation    LTE  ← ⚠️ 원문이 세대를 말하지 않는다. 이름에 「5G」가 없어 LTE로 담음
monthlyFee    4400
promo         null
dataGB        6
throttleMbps  1
voiceMinutes  200
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
