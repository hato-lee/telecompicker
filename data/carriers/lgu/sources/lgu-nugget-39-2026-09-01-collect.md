# 너겟39 — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/direct/nerget/LPZ1004897>
- 목록에서 온 길: 모바일 요금제 「온라인 가입 전용」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | 너겟39 |
| 딱지 | 최신 |
| 월정액 | 월정액 39,000원 (페이지에 「부가세 포함」 문구 없음) |
| 약정 할인 안내 | (페이지에 없음 — 무약정 상품) |
| 머리줄(음성) | 집/이동전화 기본제공 +부가통화 300분 |
| 머리줄(문자) | 문자 기본제공 |
| 머리줄(망) | 5G |
| 데이터 | 27GB +다 쓰면 최대 1Mbps |

### 내부 목록 API가 준 값 (POST /uhdc/fo/prdv/mblppexhi/v2/list:get, menuId=M20162)

```json
{
 "code": "LPZ1004897",
 "basePrice": 39000,
 "finalPrice": 39000,
 "promoName": "",
 "promoDiscount": 0,
 "kind": "5G",
 "divs": "일반",
 "majors": [
  {
   "item": "데이터",
   "qty": "27GB",
   "desc": "+다 쓰면 최대 1Mbps"
  },
  {
   "item": "음성통화",
   "qty": "집/이동전화 기본제공",
   "desc": "+부가통화 300분"
  },
  {
   "item": "문자메시지",
   "qty": "기본제공",
   "desc": ""
  }
 ]
}
```

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-nugget-39",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "너겟39",
  "generation": "5G",
  "monthlyFee": 39000,
  "promo": null,
  "dataGB": 27,
  "throttleMbps": 1,
  "voiceMinutes": null,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/direct/nerget/LPZ1004897",
  "checkedAt": "2026-09-01",
  "memo": "온라인(U+공식온라인스토어) 전용 무약정 요금제 — 공시지원금·선택약정 25% 할인 불가."
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.
