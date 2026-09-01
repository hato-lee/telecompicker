# 데이터플랜14GB — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202605259>
- 목록에서 온 길: 모바일 요금제 「전체」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | 데이터플랜14GB |
| 딱지 | 최신 |
| 월정액 | 월정액 55,000원 (부가세 포함) |
| 약정 할인 안내 | 약정 할인 시 41,250원 |
| 머리줄(음성) | 집/이동전화 기본제공 +부가통화 300분 |
| 머리줄(문자) | 문자 기본제공 |
| 머리줄(망) | 5G |
| 데이터 | 14GB +다 쓰면 최대 1Mbps |
| 공유 데이터 | 테더링+쉐어링 기본 제공량 내 |
| 맞춤형 혜택 | 연령/복지/외국인 맞춤 혜택 |

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-data-plan-14gb",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "데이터플랜14GB",
  "generation": "5G",
  "monthlyFee": 55000,
  "promo": null,
  "dataGB": 14,
  "throttleMbps": 1,
  "voiceMinutes": null,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202605259",
  "checkedAt": "2026-09-01"
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.
