# 데이터플랜24GB(키즈/청소년) — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `lgu-data-plan-24gb-kids-teen`
- LGU+ 요금제 코드: `LPZ1008258`
- 상세 페이지(= sourceUrl): https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ1008258
- 연령 변종 목록 API: `GET https://www.lguplus.com/uhdc/fo/prdv/mblppexhi/v2/<기준코드>/segments?urcHposMblPpCd=<기준코드>`
- 기준 요금제: 「데이터플랜24GB」 (월정액 59,000원 — 연령 변종도 같은 값)
- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> 상세 페이지 「연령대」 분류 「만18세 이하」 · segments API 나이 구간 4~18 · 표 머리글 「키즈 (만 4세~12세)」+「청소년 (만 13세~18세)」

→ `ageMin: 4` · `ageMax: 18`

## 원문 값

| 칸 | 원문 그대로 |
|---|---|
| 요금제명 | 데이터플랜24GB(키즈/청소년) |
| 월정액 | 59,000원 (원문 `부가세 포함`) |
| 데이터 | 24GB +다 쓰면 최대 1Mbps |
| 음성통화 | 집/이동전화 기본제공 |
| 문자메시지 | 기본제공 |
| 공유 데이터 | 테더링 기본 제공량 내 |
| 세그먼트(연령) | 키즈/청소년 · 나이 구간 4~18 · 그림 대체글 「키즈/청소년」 |
| 같은 값 「일반」 세그먼트의 데이터 | 24GB +다 쓰면 최대 1Mbps |
| 약정 할인 시 | 원문에 있으나 **담지 않는다**(선택약정 25%) |

## 우리 그릇에 담은 값

```json
{
  "id": "lgu-data-plan-24gb-kids-teen",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "데이터플랜24GB(키즈/청소년)",
  "generation": "5G",
  "monthlyFee": 59000,
  "promo": null,
  "dataGB": 24,
  "dailyDataGB": null,
  "throttleMbps": 1,
  "voiceMinutes": null,
  "smsIncluded": true,
  "ageMin": 4,
  "ageMax": 18,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ1008258",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 상세 페이지 「연령대」 분류 「만18세 이하」 · segments API 나이 구간 4~18 · 표 머리글 「키즈 (만 4세~12세)」+「청소년 (만 13세~18세)」 → ageMin 4 / ageMax 18. LGU+ 내부 segments API(키즈/청소년) 나이 구간 4~18. 월정액은 기준 요금제 「데이터플랜24GB」과 같은 59,000원(원문 「부가세 포함」) — 연령 변종은 값이 아니라 제공량이 달라진다. 「약정 할인 시」(선택약정 25%)는 담지 않는다. 맞춤형 혜택 원문: 「청소년 보호 정책」."
}
```

## 담지 않은 값

- 선택약정 25% 할인가 (DECIDED 2026-09-01: 공시 정가만).
- `promo`: null — 기간이 적힌 월정액 할인이 원문에 없다.
- 공유 데이터·멤버십 등급·청소년 보호 정책 등은 담을 칸이 없다(`memo`에만).
