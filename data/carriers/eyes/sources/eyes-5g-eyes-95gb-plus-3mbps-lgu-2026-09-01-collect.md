# [L]5G 아이즈95GB+3Mbps — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://www.eyes.co.kr/payplan/plan_info/10662/C01
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | [L]5G 아이즈95GB+3Mbps |
| 배지 | LGU+ · 7개월 할인 |
| 데이터 | 95GB + 3Mbps |
| 통화 | 기본제공 + 영상/부가통화 300분 |
| 문자 | 기본제공 |
| 정가(취소선) | 53,900원 |
| 표시가 | 첫 7개월간 월 12,500원 |

### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
| 7개월 동안 | 12,500원 |
| 평생 | 53,900원 |

## 스키마에 담은 값

```
id            eyes-5g-eyes-95gb-plus-3mbps-lgu
carrier       아이즈모바일 / mvno / network LGU+
generation    5G
monthlyFee    53900
promo         { months: 7, feeDuring: 12500 }
dataGB        95
throttleMbps  3
voiceMinutes  null (무제한)
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
