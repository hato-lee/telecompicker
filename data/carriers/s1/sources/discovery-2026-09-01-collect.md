# 에스원 안심모바일 — 2026-09-01 수집 스냅샷 (무엇을 봤나)

- 목록 통로: `POST http://www.s1mobile.co.kr/home/plan/getPlanRateList.do` (`#srhForm` 직렬화)
- 세 망 × 그룹 5가지를 다 부르고 겹치는 것을 지운 결과 **33건**
- 원문 전체는 옆의 `all-2026-09-01-getPlanRateList.json`

## TCount와 list가 다르다 (실측)

| 망 | TCount | 실제로 온 list |
|---|---|---|
| SKT | 17 | 4 |
| KT | 19 | 18 |
| LGU+ | 44 | 12 |

`rateCode=03`(데이터/통화 필요한 만큼)은 LGU+에서 `TCount=17`인데 `list`가 **0건**이다.
`rateDv=P`(휴대폰요금)는 12개 조합 전부 `list` 0건.

## 값 규칙의 근거 — 목록 화면의 렌더 코드 (rateList.do 인라인 script)

```js
inHtml + '<p class="price_original">' + commaStr(parseInt(fltList[i].bassChrge * 1.1)) + "</p>";
inHtml + '<p class="price_sale">'     + commaStr(parseInt(fltList[i].bassChrge*1.1)
                                              - parseInt(fltList[i].chrgeDscnt*1.1)
                                              - parseInt(fltList[i].promoSalePrice*1.1)) + "</p>";
if (fltList[i].addDispMsg != '-') inHtml + '<p class="price_future">' + fltList[i].addDispMsg + "</p>";
```

나이 제한 표(같은 파일):
```js
// 'P0301' : 일반 , 'P0302' : 주니어, 'P0303' : 시니어 , 'P0304' : 청소년
```

## 기간이 있는 쪽 — 실측 검산 (PC0OB00143 「안심 USIM 7GB+/음성기본」, SKT)

```
bassChrge 34000  chrgeDscnt 0  promoSalePrice 25817
addDispMsg  "7개월 후 23,100원"   addDispMsg4 "7개월"
addDispMsg2 "-14,300원"          addDispMsg3 "-14,100원"
```
34,000 × 1.1 = **37,400**(정가) → −14,300 = **23,100**(7개월 뒤) → −14,100 = **9,000**(7개월 동안).
교차 확인: 37,400 − 25,817×1.1 ≈ 9,000 ✓

## 기간이 없는 쪽 — KT망 15건 (⚠️ 정가로 담았다)

목록 `addDispMsg`가 전부 `"-"`. 상세 페이지
`http://www.s1mobile.co.kr/home/plan/rateView.do?rateDv=U&mno=KT&chargePlanSn=PL239Q799&pageNo=1`
본문에서 그대로 옮김:

> 기본정보 − **월정액 : 39,600원(vat 포함)**
> 기본 제공량 : 음성 기본제공 (영상/부가통화 300분), 문자 기본제공, 데이터 7GB(초과시 1Mbps속도로 추가 요금 없이 지속 사용 가능)

화면 라벨은 「기본료 월 ○원 / **프로모션 적용가** 월 ○원」뿐이고 **몇 개월인지 어디에도 없다.**
「판매가가 곧 월정액」이라는 문구도 **없다** — 오히려 39,600원을 「월정액」이라고 부른다.
→ DECIDED대로 `monthlyFee = 39,600`, `promo = null`, 할인가는 memo에만.
