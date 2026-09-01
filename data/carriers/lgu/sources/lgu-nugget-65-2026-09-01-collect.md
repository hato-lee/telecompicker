# 너겟65 — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/direct/nergetunlimited/Z202500388>
- 목록에서 온 길: 모바일 요금제 「온라인 가입 전용」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | 너겟65 |
| 딱지 | 최신 |
| 월정액 | 월정액 65,000원 (페이지에 「부가세 포함」 문구 없음) |
| 약정 할인 안내 | (페이지에 없음 — 무약정 상품) |
| 머리줄(음성) | 집/이동전화 기본제공 +부가통화 300분 |
| 머리줄(문자) | 문자 기본제공 |
| 머리줄(망) | 5G |
| 데이터 | 무제한 |
| 공유 데이터 | 테더링+쉐어링 80GB |
| 스마트기기 | 1대 월정액 할인 (최대 11,000원) |
| 멤버십 혜택 | 24개월간 VIP 등급 |

### 내부 목록 API가 준 값 (POST /uhdc/fo/prdv/mblppexhi/v2/list:get, menuId=M20162)

```json
{
 "code": "Z202500388",
 "basePrice": 65000,
 "finalPrice": 65000,
 "promoName": "",
 "promoDiscount": 0,
 "kind": "5G",
 "divs": "일반",
 "majors": [
  {
   "item": "데이터",
   "qty": "무제한",
   "desc": ""
  },
  {
   "item": "공유 데이터",
   "qty": "테더링+쉐어링 80GB",
   "desc": ""
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
  },
  {
   "item": "스마트기기",
   "qty": "1대 월정액 할인 (최대 11,000원)",
   "desc": ""
  },
  {
   "item": "프로모션 적용가",
   "qty": "53800",
   "desc": ""
  },
  {
   "item": "멤버십 혜택",
   "qty": "24개월간 VIP 등급",
   "desc": ""
  }
 ]
}
```

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-nugget-65",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "너겟65",
  "generation": "5G",
  "monthlyFee": 65000,
  "promo": null,
  "dataGB": null,
  "throttleMbps": null,
  "voiceMinutes": null,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/direct/nergetunlimited/Z202500388",
  "checkedAt": "2026-09-01",
  "memo": "온라인(U+공식온라인스토어) 전용 무약정 요금제 — 공시지원금·선택약정 25% 할인 불가."
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.

> ⚠️ 내부 목록 API의 `majors`에 「프로모션 적용가」 숫자가 하나 들어 있으나(위 JSON 참고),
> **몇 개월 동안인지·언제까지인지 원문 어디에도 없다.** 상세 페이지 월정액에도 안 나온다.
> 스키마의 `promo`는 `months`가 필수라 지어낼 수 없어 `null`로 두었다. 총괄 판정 대상.
