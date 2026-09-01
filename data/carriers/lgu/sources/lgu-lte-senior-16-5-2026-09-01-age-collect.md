# LTE 시니어 16.5 — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `lgu-lte-senior-16-5`
- LGU+ 요금제 코드: `LPZ0002291`
- 상세 페이지(= sourceUrl): https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0002291

- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> 유의사항 「시니어 요금제는 만 65세 이상만 가입할 수 있어요.」 · 「연령대」 분류 「만65세 이상」

→ `ageMin: 65` · `ageMax: null`

## 원문 값

| 칸 | 원문 그대로 |
|---|---|
| 요금제명 | LTE 시니어 16.5 |
| 월정액 | 16,500원 (원문 `부가세 포함`) |
| 데이터 | 300MB +다 쓰면 최대 400Kbps |
| 음성통화 | 100분 +지정번호 3개 음성통화 50분/ 영상통화 30분 사용 가능 |
| 문자메시지 | 문자 150건 |

| 약정 할인 시 | 원문에 있으나 **담지 않는다**(선택약정 25%) |

## 우리 그릇에 담은 값

```json
{
  "id": "lgu-lte-senior-16-5",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "LTE 시니어 16.5",
  "generation": "LTE",
  "monthlyFee": 16500,
  "promo": null,
  "dataGB": 0.3,
  "dailyDataGB": null,
  "throttleMbps": 0.4,
  "voiceMinutes": 100,
  "smsIncluded": true,
  "ageMin": 65,
  "ageMax": null,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-senior/LPZ0002291",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 유의사항 「시니어 요금제는 만 65세 이상만 가입할 수 있어요.」 · 「연령대」 분류 「만65세 이상」 → ageMin 65 / ageMax 없음. 월정액 16,500원(원문 「부가세 포함」). 「약정 할인 시」는 담지 않는다. 음성 원문 「100분 +지정번호 3개 음성통화 50분/ 영상통화 30분 사용 가능」 → 일반 통화 제공량인 100분만 담았다. 문자 원문 「문자 150건」(무제한 아님). 상세 페이지 소개 「가족과 통화는 자주 하고 LTE 데이터사용을 원하는 만 65세 이상 고객님을 위한 LTE 요금제」"
}
```

## 담지 않은 값

- 선택약정 25% 할인가 (DECIDED 2026-09-01: 공시 정가만).
- `promo`: null — 기간이 적힌 월정액 할인이 원문에 없다.
- 공유 데이터·멤버십 등급·청소년 보호 정책 등은 담을 칸이 없다(`memo`에만).
