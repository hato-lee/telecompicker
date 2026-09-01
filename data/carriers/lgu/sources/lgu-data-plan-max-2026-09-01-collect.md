# 데이터플랜MAX — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202605251>
- 목록에서 온 길: 모바일 요금제 「전체」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | 데이터플랜MAX |
| 딱지 | 최신 |
| 월정액 | 월정액 85,000원 (부가세 포함) |
| 약정 할인 안내 | 약정 할인 시 63,750원 |
| 머리줄(음성) | 집/이동전화 기본제공 +부가통화 300분 |
| 머리줄(문자) | 문자 기본제공 |
| 머리줄(망) | 5G |
| 데이터 | 무제한 |
| 공유 데이터 | 테더링+쉐어링 70GB |
| 멤버십 혜택 | VIP 등급 |
| 맞춤형 혜택 | 연령/외국인 맞춤 혜택 |

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-data-plan-max",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "데이터플랜MAX",
  "generation": "5G",
  "monthlyFee": 85000,
  "promo": null,
  "dataGB": null,
  "throttleMbps": null,
  "voiceMinutes": null,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/Z202605251",
  "checkedAt": "2026-09-01"
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.
