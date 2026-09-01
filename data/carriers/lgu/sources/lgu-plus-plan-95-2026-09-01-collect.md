# 플러스플랜95 — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1006509>
- 목록에서 온 길: 모바일 요금제 「전체」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | 플러스플랜95 |
| 딱지 | 최신 |
| 월정액 | 월정액 95,000원 (부가세 포함) |
| 약정 할인 안내 | 약정 할인 시 71,250원 |
| 머리줄(음성) | 집/이동전화 기본제공 +부가통화 300분 |
| 머리줄(문자) | 문자 기본제공 |
| 머리줄(망) | 5G |
| 데이터 | 무제한 |
| 공유 데이터 | 테더링+쉐어링 80GB |
| 스마트기기 | 1대 월정액 할인 (최대 11,000원) |
| 데일리플러스 | 디지털 콘텐츠 1개 선택 |

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-plus-plan-95",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "플러스플랜95",
  "generation": "5G",
  "monthlyFee": 95000,
  "promo": null,
  "dataGB": null,
  "throttleMbps": null,
  "voiceMinutes": null,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/5g-all/5g-unlimited/LPZ1006509",
  "checkedAt": "2026-09-01"
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.
