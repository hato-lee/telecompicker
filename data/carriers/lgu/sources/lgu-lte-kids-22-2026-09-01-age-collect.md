# LTE 키즈 22 — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `lgu-lte-kids-22`
- LGU+ 요금제 코드: `LPZ0002473`
- 상세 페이지(= sourceUrl): https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0002473

- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> 요금제 이름이 「LTE 키즈 22(만 12세 이하)」 · 유의사항 「만 4세부터 만 12세까지 본인 명의 휴대폰번호 1개에서만 키즈 요금제에 가입할 수 있어요.」 · 「연령대」 분류 「만12세 이하」

→ `ageMin: 4` · `ageMax: 12`

## 원문 값

| 칸 | 원문 그대로 |
|---|---|
| 요금제명 | LTE 키즈 22 |
| 월정액 | 22,000원 (원문 `부가세 포함`) |
| 데이터 | 700MB +다 쓰면 최대 400Kbps |
| 음성통화 | 60분 +지정번호 2개(망내) 음성통화 무제한 |
| 문자메시지 | 문자 기본제공 |

| 약정 할인 시 | 원문에 있으나 **담지 않는다**(선택약정 25%) |

## 우리 그릇에 담은 값

```json
{
  "id": "lgu-lte-kids-22",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "LTE 키즈 22",
  "generation": "LTE",
  "monthlyFee": 22000,
  "promo": null,
  "dataGB": 0.7,
  "dailyDataGB": null,
  "throttleMbps": 0.4,
  "voiceMinutes": 60,
  "smsIncluded": true,
  "ageMin": 4,
  "ageMax": 12,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-youth/LPZ0002473",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 요금제 이름이 「LTE 키즈 22(만 12세 이하)」 · 유의사항 「만 4세부터 만 12세까지 본인 명의 휴대폰번호 1개에서만 키즈 요금제에 가입할 수 있어요.」 · 「연령대」 분류 「만12세 이하」 → ageMin 4 / ageMax 12. 월정액 22,000원(원문 「부가세 포함」). 「약정 할인 시」는 담지 않는다. 음성 원문 「60분 +지정번호 2개(망내) 음성통화 무제한」 → 일반 통화 제공량인 60분만 담았다. 「만 13세가 되는 날까지 다른 요금제로 변경하지 않으면 그 다음달 1일 ‘데이터플랜5GB(청소년+2GB)’ 요금제로 자동 변경돼요.」"
}
```

## 담지 않은 값

- 선택약정 25% 할인가 (DECIDED 2026-09-01: 공시 정가만).
- `promo`: null — 기간이 적힌 월정액 할인이 원문에 없다.
- 공유 데이터·멤버십 등급·청소년 보호 정책 등은 담을 칸이 없다(`memo`에만).
