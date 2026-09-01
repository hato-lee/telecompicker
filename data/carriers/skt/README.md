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
