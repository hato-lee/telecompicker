# [S]OK캐쉬백 7GB+ — 원문에서 본 값 (2026-09-01 확인)

- 원문(상세): https://www.eyes.co.kr/payplan/plan_info/597/C01
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | [S]OK캐쉬백 7GB+ |
| 배지 | SKT · OK캐쉬백 · 12개월 할인 |
| 데이터 | 7GB + 1Mbps |
| 통화 | 기본제공 + 영상/부가통화 300분 |
| 문자 | 기본제공 |
| 정가(취소선) | 28,600원 |
| 표시가 | 첫 12개월간 월 16,900원 |
| 제휴 혜택 | 매월 OK캐쉬백 5,000P (정가 5,000원) / SOLO 결합 시 추가 5GB X 24개월 |

### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
| 12개월 동안 | 16,900원 |
| 평생 | 28,600원 |

## 스키마에 담은 값

```
id            eyes-okcashbag-7gb-plus-skt
carrier       아이즈모바일 / mvno / network SKT
generation    LTE  ← ⚠️ 원문이 세대를 말하지 않는다. 이름에 「5G」가 없어 LTE로 담음
monthlyFee    28600
promo         { months: 12, feeDuring: 16900 }
dataGB        7
throttleMbps  1
voiceMinutes  null (무제한)
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
