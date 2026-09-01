# [S]이디야 블루 15GB+/100분 — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://www.eyes.co.kr/payplan/plan_info/616/C01
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | [S]이디야 블루 15GB+/100분 |
| 배지 | SKT · 이디야 · 7개월 할인 |
| 데이터 | 15GB + 3Mbps |
| 통화 | 100분 |
| 문자 | 100건 |
| 정가(취소선) | 37,400원 |
| 표시가 | 첫 7개월간 월 7,700원 |
| 제휴 혜택 | 매 월 이디야 6,000원 카드 (정가 6,000원) / SOLO 결합 시 추가 10GB X 24개월 |

### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
| 7개월 동안 | 7,700원 |
| 평생 | 37,400원 |

## 스키마에 담은 값

```
id            eyes-ediya-blue-15gb-plus-100-min-skt
carrier       아이즈모바일 / mvno / network SKT
generation    LTE  ← ⚠️ 원문이 세대를 말하지 않는다. 이름에 「5G」가 없어 LTE로 담음
monthlyFee    37400
promo         { months: 7, feeDuring: 7700 }
dataGB        15
throttleMbps  3
voiceMinutes  100
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
