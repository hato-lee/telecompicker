# SKT — 원문 길

- 시작점: `https://www.tworld.co.kr/web/product/plan/list` (T월드 요금제 목록)
- 상태 (2026-09-01, SKT 갈래): **길 뚫음.** 정적 HTML엔 요금제가 없지만,
  페이지가 두드리는 **내부 JSON API가 쿠키 없이 그냥 열린다.** playwright는 API 주소를 찾을 때만 썼고,
  실제 수집은 `fetch`만으로 된다.
- 스냅샷 규칙: `sources/<요금제id>-<YYYY-MM-DD>-<목적>.md` — 덮어쓰지 않는다.
- 수집 스크립트: **`scripts/fetch-skt-plans.mjs`** (`--dump <dir>`로 요금제별 원문 저장, `--text <prodId>`로 공시 본문 보기)

## ⭐ 데이터 통로 (2026-09-01 뚫음)

### 1) 전체 목록 — 한 번에 다 나온다

```
GET https://www.tworld.co.kr/core-product/v1/product/mobile/plan-overall-list
      ?idxCtgCd=F01100&size=500&page=1&order=
Referer: https://www.tworld.co.kr/web/product/plan/list
```

- 응답 `result.mobilePlanList[]`, `result.totalCount` — **2026-09-01 기준 110개** (이게 「지금 가입 가능한 전부」다)
- 쓸 칸: `prodId`(예 `NA00009793`) `prodNm` `basFeeInfo`(월정액, **부가세 포함**)
  `basOfrGbDataQtyCtt`(GB 또는 "무제한") `basOfrMbDataQtyCtt`(MB 표기 요금제)
  `qosDataQtyCtt`(소진 후 속도, 예 "최대 400kbps") `basOfrVcallTmsCtt` `basOfrCharCntCtt`
  `shrDataQtyCtt`(공유/테더링 한도) `addTcCtt`(영상/부가통화 분)
  `selAgrmtAplyMfixAmt`(**선택약정 25% 반영가 — 담지 않는다**)
  `prodFltList[]`(그 요금제가 속한 필터 = 5G/LTE/나이 제한 없음/만 34세 이하/복지/선불폰/태블릿…)
- ⚠️ `prodFltList`는 **`prodFltId`와 `prodFltNm`이 어긋난 줄이 있다**(예 `베스트 Max(Google AI)`에서
  `F01161:Google AI`, `F02094:나이 제한 없음` — 필터 정의와 반대). **이름(`prodFltNm`)으로 판정할 것.**

### 2) 요금제 상세(공시) — 값의 최종 근거

```
GET https://www.tworld.co.kr/core-product/v1/ledger/<prodId>/summaries
GET https://www.tworld.co.kr/core-product/v1/ledger/<prodId>/contents
Referer: https://www.tworld.co.kr/web/product/callplan/<prodId>   ← ⚠️ 이게 없으면 401
```

- `contents.contentsList[].titleNm` 중 **「이용 요금 및 기본 혜택」**이 공시표다.
  머리글에 「월정액 **(부가세 포함**, \*선택약정 반영 금액)」이라고 박혀 있다 → `basFeeInfo`는 **정가·부가세 포함**이 확정.
- 사람이 보는 페이지: `https://www.tworld.co.kr/web/product/callplan/<prodId>` (= 우리 `sourceUrl`)

### 3) 필터 정의(분류표)

```
GET https://www.tworld.co.kr/core-product/v1/submain/filters?idxCtgCd=F01100
```

- 대상(F01160): 나이 제한 없음 F01161 · 만 12세 이하 · 만 18세 이하 · 만 34세 이하 ·
  만 65/70/80세 이상 · 복지 · 군인
- 기기(F01120): 5G F01713 · LTE F01121 · 3G · 태블릿/스마트 기기 F01124 · 선불폰 F01125
- 2026 라인업(F02086): 베스트 F02087 · 라이트 F02088 · 전용 F02100 · 스마트기기 F02089 · 다이렉트 F02101
- 묶음 목록도 있다: `GET /core-product/v1/submain/grp-prcplns?size=100&page=1&order=&idxCtgCd=F02087`
  (**F0208x/F0210x 분류 코드에만 응답한다.** 기기/대상 코드를 넣으면 빈 `result`)

### 4) ⭐ 나이(대상)별 목록 — 라운드 2에서 뚫음 (2026-09-01)

「만 34세 이하 요금제만 보여줘」처럼 대상 코드로 **골라 받는 길**이다.
쓰는 열쇠말은 `prodFltId`가 아니라 **`targetProdFltIds`** — 이걸 몰라서 헤맸다(아래 「뒤진 곳」).

```
GET https://www.tworld.co.kr/core-product/v1/product/mobile/plan-filter-list
      ?idxCtgCd=F01100&size=200&page=1&order=&targetProdFltIds=<대상코드>
Referer: https://www.tworld.co.kr/web/product/plan/list
```

2026-09-01 기준 결과(= SKT가 **지금 새로 받는** 연령/대상 전용 요금제 전부):

| 대상코드 | 뜻 | 개수 | 요금제 |
|---|---|---|---|
| F01166 | 만 12세 이하 | 3 | ZEM플랜 퍼펙트·베스트·스마트 |
| F01162 | 만 18세 이하 | 3 | (위와 같은 ZEM플랜 3개 — **따로 있는 청소년 요금제가 아니다**) |
| F01165 | 만 34세 이하 | 11 | 0 청년 다이렉트 30/34/42/48/55/62/69(T 우주/넷플릭스×2/티빙/디즈니+) |
| F01163 / F01167 / F01168 | 만 65 / 70 / 80세 이상 | **0** | **없다** — SKT엔 지금 새로 받는 시니어 요금제가 하나도 없다 |
| F02030 | 군인 | **0** | 없다 |
| F01164 | 복지 | 4 | 손누리 3.0G/1.5G · 소리누리 2.4G/1.2G (장애인 복지 — 담지 않는다) |

- 즉 **SKT의 연령 전용은 「어린이(ZEM) 3개 + 청년 11개」가 전부**다. 시니어·청소년 전용은 없다.
- 나이 문구는 목록이 아니라 **공시(`ledger/<prodId>/contents`)의 「가입 조건」·「가입 대상」 항목**에 있다.
  0 청년 다이렉트: 「5G/LTE 스마트폰을 사용하시는 **만 34세 이하** 고객님만 가입하실 수 있습니다.」
  단 OTT 묶음판은 다르다 — 넷플릭스판은 「**만 19세 이상~만 34세 이하** 개인 고객님」,
  디즈니+판은 「만 19세 이상 고객님만 가입」 + 「만 34세 이하만 가입 가능」. **묶음판마다 따로 읽어야 한다.**
  ZEM플랜: 「**만 12세 이하** 개인명의 고객님에 한하여 1인 1회선 가입 가능」.
- ⚠️ 0 청년 다이렉트에는 나이 말고 **가입 경로 조건**이 붙는다 —
  「T 다이렉트샵에서 신규가입/기기변경 또는 유심을 개통한 경우에만(개통일 포함 15일 안에)」.
  라운드 1이 같은 조건의 `다이렉트5G`를 담았기에 라운드 2도 같은 기준으로 담았다.

### 길 찾은 방법 (다음에 막히면 이렇게)

1. playwright로 `/web/product/plan/list`를 열고 `page.on('response')`로 xhr/fetch만 걸러 본다.
2. 목록 페이지 스크립트 `https://www.tworld.co.kr/web/js/product/plan/list/plan.list.js`에
   `oTw.Api.getBffApiCmd({bffApiNo: "BFF_10_0053"})` 식으로 **BFF 번호만** 적혀 있다.
3. 번호 → 실제 경로는 페이지 안에서 `page.evaluate(() => oTw.Api.getBffApiCmd({bffApiNo:'BFF_10_0053'}))`로 푼다.
   - BFF_10_0053 = `/core-product/v1/product/mobile/plan-overall-list` (전체 목록)
   - BFF_10_0054 = `/core-product/v1/product/mobile/plan-filter-list` (필터 적용 목록)
   - BFF_10_0056 = `/core-product/v1/submain/filters`
   - BFF_10_0287 = `/core-product/v1/mobiles/fee-plans/group-products`
   - BFF_10_0288 = `/core-product/v1/submain/grp-prcplns`

## 뒤진 곳 (길이 막혔던 기록)

- `GET /v1/common/bff-meta` — BFF번호↔경로 표를 통째로 줄 줄 알았는데, 그냥 부르면 빈 응답이 온다.
  대신 위 3번(페이지 안에서 `oTw.Api.getBffApiCmd` 호출)으로 풀었다.
- `grp-prcplns`에 기기 코드(F01713 5G, F01121 LTE)나 대상 코드(F01161)를 넣으면 `result`가 빈 객체.
  분류별 목록은 2026 라인업 코드로만 된다.
- `plan-filter-list`에 `prodFltId=<코드>`를 넣으면 **필터가 안 먹고 110개 전부**가 온다(조용히 무시된다).
  열쇠말은 `targetProdFltIds`다 — 목록 페이지 스크립트
  `https://www.tworld.co.kr/web/js/product/plan/list/plan.list.js`의
  `params.targetProdFltIds = this.filterList` 줄에서 찾았다. (2026-09-01 라운드 2)
- `ledger/<prodId>/summaries|contents`를 목록 페이지 Referer로 부르면 **401**. Referer를 그 요금제
  상세 페이지(`/web/product/callplan/<prodId>`)로 바꾸면 200. 쿠키는 필요 없었다.
- 스마트초이스 발견 목록의 SKT 요금제(`../smartchoice/sources/planlist-*-discovery.json`의
  `mnoPlanList`에서 `TEL_NAME == "SKT"`)는 **아직 대조에 쓰지 않았다** — T월드 목록 API가 전부를 주므로 불필요했다.

## 2026-09-01 수집에서 정한 것 (총괄 대조용)

- **`monthlyFee` = `basFeeInfo` (공시 정가·부가세 포함).** `selAgrmtAplyMfixAmt`(선택약정 25% 반영가)는 담지 않는다.
  **선택약정(25% 요금할인)은 거의 모든 요금제가 「가입 가능」이라 요금제를 가르는 값이 아니다** —
  화면에서 필요하면 `monthlyFee × 0.75`로 따로 보여주면 된다.
- `promo`는 전부 `null`. 담은 62개 중 **요금제 자체의 월정액을 기간 한정으로 깎아 주는 것은 없었다.**
  ("24개월 할부금 할인", "T 우주 구독료 프로모션"은 요금제 월정액이 아니다.)
- 「5G/LTE 스마트폰으로 가입하실 수 있습니다」인 요금제(베스트·라이트 39개)는 `generation: "5G"`로 담고
  `memo`에 원문 문장을 남겼다. 스키마에 「둘 다」 칸이 없다.
- 담지 않은 것: 연령/대상 전용 18개 · 태블릿·워치·투넘버 11개 · 선불(PPS) 12개 ·
  외국인 전용(Easy) 4개 · 라우터/IoT 3개. 자세한 근거는 `sources/planlist-2026-09-01-discovery.json`.

## 2026-09-01 라운드 2에서 담은 것 (연령 전용)

- 라운드 1이 뺐던 **연령 전용 18개 중 14개를 담았다**(위 ④의 F01166/F01162/F01165).
  나머지 4개(복지 F01164 — 손누리·소리누리)는 **장애인 복지 등록자 전용**이라 나이 조건이 아니어서 계속 뺐다.
- 담은 값의 기준은 라운드 1과 같다: `monthlyFee` = `basFeeInfo`(공시 정가·부가세 포함), `promo`는 전부 null.
- `generation`은 라운드 1과 같이 **`prodFltList`의 기기 필터**로 판정했다
  (0 청년 다이렉트·ZEM 퍼펙트/베스트 = `5G` 하나뿐 → `5G`, ZEM 스마트 = `5G`+`LTE` → `5G/LTE`).
- ZEM플랜 스마트의 음성 원문은 「60분 +SKT 지정 2회선 음성 무제한」 → **일반 통화 제공량인 60분만** 담았다
  (지정 2회선 무제한은 담을 칸이 없다).
