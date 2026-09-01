# 데이터플랜750MB(청소년+0.5GB) — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `lgu-data-plan-750mb-teen`
- LGU+ 요금제 코드: `LPZ1007769`
- 상세 페이지(= sourceUrl): https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ1007769
- 연령 변종 목록 API: `GET https://www.lguplus.com/uhdc/fo/prdv/mblppexhi/v2/<기준코드>/segments?urcHposMblPpCd=<기준코드>`
- 기준 요금제: 「데이터플랜750MB」 (월정액 29,000원 — 연령 변종도 같은 값)
- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> 상세 페이지 「데이터 안내」 표 머리글 「청소년 (만 13세~18세)」 · 「맞춤형 혜택 안내」 표 「만 13세 이상 만 19세 미만 고객이 청소년 혜택 대상 요금제 가입 시」

→ `ageMin: 13` · `ageMax: 18`

## 원문 값

| 칸 | 원문 그대로 |
|---|---|
| 요금제명 | 데이터플랜750MB(청소년+0.5GB) |
| 월정액 | 29,000원 (원문 `부가세 포함`) |
| 데이터 | 1.25GB + 다 쓰면 최대 400Kbps |
| 음성통화 | 집/이동전화 125분 |
| 문자메시지 | 기본제공 |
| 공유 데이터 | 테더링 기본 제공량 내 |
| 세그먼트(연령) | 청소년 · 나이 구간 13~19 · 그림 대체글 「청소년」 |
| 같은 값 「일반」 세그먼트의 데이터 | 750MB + 다 쓰면 최대 400Kbps |
| 약정 할인 시 | 원문에 있으나 **담지 않는다**(선택약정 25%) |

## 우리 그릇에 담은 값

```json
{
  "id": "lgu-data-plan-750mb-teen",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "데이터플랜750MB(청소년+0.5GB)",
  "generation": "5G",
  "monthlyFee": 29000,
  "promo": null,
  "dataGB": 1.25,
  "dailyDataGB": null,
  "throttleMbps": 0.4,
  "voiceMinutes": 125,
  "smsIncluded": true,
  "ageMin": 13,
  "ageMax": 18,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-youth/LPZ1007769",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 상세 페이지 「데이터 안내」 표 머리글 「청소년 (만 13세~18세)」 · 「맞춤형 혜택 안내」 표 「만 13세 이상 만 19세 미만 고객이 청소년 혜택 대상 요금제 가입 시」 → ageMin 13 / ageMax 18. LGU+ 내부 segments API(청소년) 나이 구간 13~19. 월정액은 기준 요금제 「데이터플랜750MB」과 같은 29,000원(원문 「부가세 포함」) — 연령 변종은 값이 아니라 제공량이 달라진다. 「약정 할인 시」(선택약정 25%)는 담지 않는다. 맞춤형 혜택 원문: 「데이터 추가 제공」."
}
```

## 담지 않은 값

- 선택약정 25% 할인가 (DECIDED 2026-09-01: 공시 정가만).
- `promo`: null — 기간이 적힌 월정액 할인이 원문에 없다.
- 공유 데이터·멤버십 등급·청소년 보호 정책 등은 담을 칸이 없다(`memo`에만).
