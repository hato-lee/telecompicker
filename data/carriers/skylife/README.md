# kt스카이라이프 모바일 — 길 지도

수집 갈래가 2026-09-01 뚫음. KT 자회사 알뜰폰(위성방송 스카이라이프의 알뜰폰).
**공식: https://www.skylife.co.kr/product/mobile/all**

## 어느 주소가 진짜인가 (판단 근거)

- 검색으로 나온 후보 넷 중 셋이 **같은 곳으로 넘어간다**:
  - `shop.skylife.co.kr/mvno/usimPayPlan` → `www.skylife.co.kr/product/mobile/all`
  - `mshop.skylife.co.kr/mvno/main` → `m.skylife.co.kr/product/mobile/all` (모바일판, 내용 동일)
- `www.skylifemobile.co.kr` · `mobile.skylife.co.kr`는 **DNS부터 없다**(연결 실패).
- `ktsky.kr`·`kt-skylife.kr`는 대리점 페이지다 — 쓰지 않았다.
- `<title>모바일 요금제 | 모바일 | **스카이라이프 공식 온라인샵**`, `og:site_name`도 같다.

## 통로 — Next.js App Router의 「flight」 데이터

화면 카드는 JS가 그리지만, **첫 HTML 안에 요금제 데이터가 통째로 들어 있다.**

1. `GET https://www.skylife.co.kr/product/mobile/all` (약 2.5MB)
2. 본문에서 `self.__next_f.push([1,"…"])` 조각(508개)을 순서대로 `JSON.parse` 해서 이어 붙인다
3. 이어 붙인 글에서 `^([0-9a-f]+):(.*)$` 줄을 골라 **id → 값** 표를 만든다
4. `"$1a2"` 꼴의 참조를 그 표로 풀면(`$` 뒤 id) 완전한 객체가 된다
5. `type == "MOBILE_PLAN"`인 객체가 요금제다 — **209개, 슬러그 중복 102개를 빼면 107개**
   (화면 문구 「총 107개」와 일치)

```json
{"type":"MOBILE_PLAN","slug":"pl231k975","name":"5G 모두 충분 110GB+","code":"PL231K975",
 "price":{"baseFee":49500,"default":[{"period":{"unit":"월","value":1},"fee":42900}],
          "conditional":null,"mvnoDiscount":null},
 "properties":{"voice":{"unit":"기본제공","description":"(영상/부가 300분)"},
               "data":{"unit":"MB","limit":110000,"qosUnit":"Mbps","qosLimit":5,
                       "description":"(소진 시 5Mbps 속도로 무제한)"},
               "message":{"unit":"기본제공"},"network":{"type":"LTE"}}}
```

가입 대상 제한은 **`type=="TAG"` 객체**가 알려 준다 — `주니어`(만 19세 미만) 4개,
`시니어`(만 65세 이상) 6개, `복지 전용` 1개, `스마트기기` 3개. `product` 배열의 `$id`를 슬러그로 되풀면 된다.

## ⚠️ 함정

- ⭐ **요금이 둘이다.** `price.baseFee`(49,500)와 `price.default[0].fee`(42,900).
  **화면에 보이는 건 `fee` 하나뿐이다** — 취소선 정가 표기가 아예 없다(HTML 전체 `line-through` **0건**),
  「할인」·「프로모션」·「정가」 글자도 payload 어디에도 없다. `baseFee`는 화면에 안 나온다.
  → `monthlyFee` = `fee`. (headless 브라우저로 직접 렌더해 확인 — `sources/skylife-price-2026-09-01-screen.md`)
- 카드에 「**제휴 혜택 적용가** 37,300원」이라는 **세 번째 값**이 뜨는 요금제가 있다.
  요금이 아니라 제휴 상품권 값어치를 뺀 계산이다. 담지 않는다.
- **슬러그가 102개 중복**된다(같은 요금제가 큐레이션 구역마다 다시 실린다). `slug`로 반드시 dedupe.
- `price.default`는 배열이라 다단계 특가를 담을 그릇이지만 **107개 전부 원소가 1개**이고
  `period`는 죄다 `{"unit":"월","value":1}`이다. **기간 제한이 걸린 요금제가 하나도 없다.**
- `data.limit`은 **MB 단위**다(110000 = 110GB). 속도제어는 `qosUnit`이 `Mbps`/`kbps` 둘 다 나온다.
- **요금제별 개별 URL이 없다.** `/product/mobile/<slug>`·`/detail/<slug>`는 전부 404 —
  한 페이지에서 서랍으로 펼친다. 그래서 `sourceUrl`은 107개 모두 목록 주소다.
- 첫 HTML이 서버에서 그려 보내는 카드는 **18개뿐**이다. 나머지는 브라우저가 그린다
  (데이터는 이미 flight에 다 있으니 값을 캐는 데는 지장 없다).

## 특가 판정

「평생/N개월」 어느 쪽 문구도 **없다.** 사용자에게 보이는 값이 `fee` 하나뿐이므로
`monthlyFee` = `fee`, `promo` = null, `memo`에 「내부 payload의 baseFee=○원은 화면에 노출되지 않는다」를 남겼다.

부가세: 값이 550원 단위(49,500 / 42,900 / 2,900)로 VAT 포함 표시가로 보인다.
**다만 「부가세 포함」이라고 못박은 문구를 페이지에서 찾지 못했다** — 지어내지 않고 여기 적어 둔다.

## 뒤진 곳

- `shop.skylife.co.kr/mvno/usimPayPlan` · `mshop.skylife.co.kr/mvno/main` — 둘 다 위 주소로 리다이렉트
- `www.skylifemobile.co.kr` · `mobile.skylife.co.kr` — DNS 없음
- `/product/mobile/<slug>` · `/product/mobile/plan|plans|detail/<slug>` — 전부 404
- `?plan=<slug>` 쿼리 — 200이지만 내용이 목록과 똑같다(서랍은 클라이언트가 연다)
- 요금제별 「요금제 특징」 HTML은 flight 안 `T…` 조각에 있다. 가입 대상 문구가 여기에도 있지만
  **TAG 객체가 더 확실하고 빠짐이 없어** 그쪽을 근거로 썼다.
