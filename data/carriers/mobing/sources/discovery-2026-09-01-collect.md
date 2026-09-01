# 모빙 — 2026-09-01 수집 스냅샷 (무엇을 봤나)

- 목록 통로: `POST https://www.mobing.co.kr/api/product/getV2PlanList` `{"page":1,"limit":9999,"telco":[]}`
- 응답 `entity.pageInfo.totalRow = 226`, `entity.list.length = 226`
- 원문 전체는 옆의 `all-2026-09-01-getV2PlanList.json`

## 할인 기간의 근거 — `getPlanInfo`가 직접 말해 준다

`GET /api/product/getPlanInfo?planID=PC0LB00226&promoSeq=9104` 응답에서 그대로 옮김:

```
"amountMon": 49500,          ← 정가
"promoSaleList": [{ "ltSaleAmount": "3300", "prSaleAmount": "36300",
  "saleList": [
    { "termMonth": "1200", "saleAmount": "3300"  },   ← 100년 = 사실상 평생
    { "termMonth": "7",    "saleAmount": "22000" },
    { "termMonth": "7",    "saleAmount": "14300" } ] }],
"totalSaleAmount": 39600, "totalAmountMon": 9900
```

목록 쪽 같은 요금제: `originAmountMon 49500 / ltSaleAmount 3300 / prSaleAmount 36300 / amountMon 9900 /
termAll "1200" / termShort "7"`.

→ 정가 49,500 − 평생할인 3,300 = **46,200원**(7개월 뒤 내는 값), 7개월 동안은 **9,900원**.

⚠️ `promoSeq`를 빼고 부르면 같은 요금제가 `promoSaleList: []`, `totalAmountMon: 49500`으로 온다(할인이 사라진다).

## 「평생」이라는 말의 근거

목록 `desc01` 분포:
- `"평생 할인 요금제"` 24건 → **전부** `termAll=1200`이고 `termShort`가 없다
- `"초특가 요금제"` 15건 → **전부** `termShort`가 있다

## 유의사항 원문 (`contents`)

> 요금제의 프로모션 할인요금은 모빙 **신규고객(신규가입/번호이동)** 대상으로만 진행됩니다.
> 기고객의 경우, 프로모션 할인요금으로 요금제 변경이 불가하며 요금제 변경시, 할인 전 기본요금으로 변경만 가능합니다.

## 실측 검산

- 226건 전부 `originAmountMon − ltSaleAmount − prSaleAmount === amountMon`
- `termAll` 없이 `termShort`만 있는 56건은 `ltSaleAmount`가 전부 0
