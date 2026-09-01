# LTE 표준 요금제 — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-general/LPZ0001204>
- 목록에서 온 길: 모바일 요금제 「LTE」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | LTE 표준 요금제 |
| 딱지 | (없음) |
| 월정액 | 월정액 11,990원 (부가세 포함) |
| 약정 할인 안내 | 약정 할인 시 8,992원 |
| 머리줄(음성) | 1초당 1.98원 |
| 머리줄(문자) | 문자 50건 |
| 머리줄(망) | LTE |
| 데이터 | 1KB당 0.275원 |

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-lte-standard",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "LTE 표준 요금제",
  "generation": "LTE",
  "monthlyFee": 11990,
  "promo": null,
  "dataGB": 0,
  "throttleMbps": null,
  "voiceMinutes": 0,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/lte-all/lte-general/LPZ0001204",
  "checkedAt": "2026-09-01",
  "memo": "데이터·음성 기본 제공 없음(데이터 1KB당 0.275원, 음성 1초당 1.98원). 문자 50건 제공."
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.
