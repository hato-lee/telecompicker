# LTE 다이렉트 22 — 2026-09-01 수집

- 원문: <https://www.lguplus.com/mobile/plan/mplan/direct/lte-direct/LPZ0000596>
- 목록에서 온 길: 모바일 요금제 「온라인 가입 전용」 탭
- 확인 날짜: 2026-09-01

## 원문에서 그대로 옮긴 값

| 칸 | 원문 |
|---|---|
| 요금제명 | LTE 다이렉트 22 |
| 딱지 | (없음) |
| 월정액 | 월정액 22,000원 (페이지에 「부가세 포함」 문구 없음) |
| 약정 할인 안내 | (페이지에 없음 — 무약정 상품) |
| 머리줄(음성) | 집/이동전화 기본제공 +부가통화 100분 |
| 머리줄(문자) | 문자 기본제공 |
| 머리줄(망) | LTE |
| 데이터 | 1.8GB +다 쓰면 최대 400Kbps |

### 내부 목록 API가 준 값 (POST /uhdc/fo/prdv/mblppexhi/v2/list:get, menuId=M20162)

```json
{
 "code": "LPZ0000596",
 "basePrice": 22000,
 "finalPrice": 22000,
 "promoName": "",
 "promoDiscount": 0,
 "kind": "LTE",
 "divs": "일반",
 "majors": [
  {
   "item": "데이터",
   "qty": "1.8GB",
   "desc": "+다 쓰면 최대 400Kbps"
  },
  {
   "item": "음성통화",
   "qty": "집/이동전화 기본제공",
   "desc": "+부가통화 100분"
  },
  {
   "item": "문자메시지",
   "qty": "기본제공",
   "desc": ""
  },
  {
   "item": "프로모션 적용가",
   "qty": "20000",
   "desc": ""
  }
 ]
}
```

## 이 스냅샷으로 채운 칸 (src/data/plans/lgu.json)

```json
{
  "id": "lgu-lte-direct-22",
  "carrier": "LG유플러스",
  "carrierType": "mno",
  "network": "LGU+",
  "name": "LTE 다이렉트 22",
  "generation": "LTE",
  "monthlyFee": 22000,
  "promo": null,
  "dataGB": 1.8,
  "throttleMbps": 0.4,
  "voiceMinutes": null,
  "smsIncluded": true,
  "sourceUrl": "https://www.lguplus.com/mobile/plan/mplan/direct/lte-direct/LPZ0000596",
  "checkedAt": "2026-09-01",
  "memo": "온라인(U+공식온라인스토어) 전용 무약정 요금제 — 공시지원금·선택약정 25% 할인 불가."
}
```

- `monthlyFee`: 공시 정가(월정액). **선택약정 25% 할인가는 넣지 않았다.**
- `promo`: 이 페이지에 「N개월 할인」 같은 기간 한정 요금 할인 표기가 없어 `null`.

> ⚠️ 내부 목록 API의 `majors`에 「프로모션 적용가」 숫자가 하나 들어 있으나(위 JSON 참고),
> **몇 개월 동안인지·언제까지인지 원문 어디에도 없다.** 상세 페이지 월정액에도 안 나온다.
> 스키마의 `promo`는 `months`가 필수라 지어낼 수 없어 `null`로 두었다. 총괄 판정 대상.
