# 헬로모바일 (LG헬로비전) — 길 지도

수집 갈래가 2026-09-01 뚫음. LG유플러스 자회사 알뜰폰. **LG U+ 망과 KT 망을 둘 다 쓴다.**

## 공식 다이렉트몰이 맞나 — 근거

`https://direct.lghellovision.net` 이 **헬로모바일 공식 다이렉트몰**이 맞다. 눈으로 확인한 근거 셋:

1. 뿌리(`/`)가 `<title>헬로모바일</title>` 을 달고 `/main.do`로 넘긴다.
2. 목록 화면의 `og:site_name` 이 `LG헬로모바일`, `canonical` 이 같은 도메인이다.
3. 같은 회사의 다른 문(`corp.lghellovision.net` 기업 홈, `ch.lghellovision.net` 케이블, `rental.lghellovision.net` 렌탈)이
   이 도메인의 머리글에서 서로 링크된다 — 한 살림이다.

⚠️ **User-Agent가 없으면 무조건 `400 Bad Request`** 를 뱉는다(HTML 오류 화면까지 준다).
브라우저 UA 한 줄만 붙이면 쿠키·세션 없이 다 열린다.

## 통로 (내부 ajax — 세션·쿠키 없이 동작 확인)

1. **요금제 목록**: `POST https://direct.lghellovision.net/fund/ajaxRateList.do`
   - body(form): `reqRateType=U` (유심 요금제) 또는 `reqRateType=P` (휴대폰 요금제)
   - 헤더: `User-Agent`(필수) · `X-Requested-With: XMLHttpRequest` · `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`
   - **필터를 하나도 안 보내면 전량이 온다** — `reqRateType=U` 만으로 144줄, `reqRateType=P` 로 143줄.
   - 화면은 기본으로 `reqTelecom=LGU` 를 끼워 부른다. 그래서 **화면만 보면 KT 망 요금제를 못 본다.**
     망을 가르려면 `reqTelecom=KT`, 세대는 `reqUsimType=5G|LTE`.
2. **요금제별 유의사항**: `POST /phone/commNoticeNew.do`
   body `paymentCode=<요금제코드>&itemGubun=USIM&cpGubun=C` → `{ noticeList: [{contents: "<html>"}] }`
   - 특가 기간·부가세·가입조건의 **말 근거가 전부 여기 있다.** 값 판정은 이 글로 한다.
3. **분류(카테고리) 나무 + 개수**: `POST /fund/ajaxRateCategoryList.do`
   body `paymentGubun=PHONE&telecom=LGU|KT&paymentType=LTE|5G&rateType=P`
   - 휴대폰 요금제 쪽에서만 쓴다. 유심 화면은 분류 탭 대신 왼쪽 거르개(필터)를 쓴다.

목록 화면 자체: `/rate/rateViewUsim.do?pgNum=0301&rateGubun=U` (유심) · `/rate/rateViewPhone.do` (휴대폰).
첫 HTML에는 요금제가 **한 줄도 없다** — 위 ajax로 그린다. 그리는 규칙(인라인 스크립트)은
`getPaymentList()` 안에 통째로 있어서, 원문 글자를 되살릴 때 그대로 베끼면 된다.

⚠️ 화면의 검색창(`#searchText` → `reqText`)은 **요금제 이름으로는 안 걸린다**(직접 시험해 봤다 — 0건).
그래서 요금제 하나만 가리키는 URL을 만들 수 없다. `sourceUrl` 은 목록 화면 주소를 쓴다.
`telecomGubun`/`menuGubun` 을 URL에 넣어도 무시된다 — 망 고르개는 언제나 LG U+로 시작한다.

## 값 필드 — ⚠️ 함정

| 필드 | 뜻 |
|---|---|
| `paymentcode` | 요금제코드(`PDLB…`=LG U+망, `PDB…`/`PD…`=KT망). 유심/휴대폰 목록이 서로 겹치지 않는다 |
| `telecom` | `LGU` / `KT` — **쓰는 망**. 화면 글자는 「LG U+ 망」/「KT 망」 |
| `usimType` | `LTE` / `5G` — 세대 |
| `dedicatedMonthlyOfferGubun` + `…Value` | 월 기본 데이터. `G`=GB, `M`=MB |
| `dedicatedDailyOfferGubun` + `…Value` | **일 단위** 추가/기본 데이터 |
| `dedicatedDataDepletionRate` | 소진 후 속도. `{1:400Kbps, 2:1Mbps, 3:3Mbps, 4:5Mbps, 5:10Mbps}`, `0`/빈칸=없음 |
| `dedicatedCallsGubun` | `L`=기본제공(무제한) / `B`=`…Value` **분** |
| `dedicatedSmsGubun` | `L`=기본제공 / `B`=`…Value` **건** (0건이면 문자 미포함) |
| `dedicatedPriceGubun` | `{J:청소년, S:시니어, T:패드, P:혜택 요금제, D:데이터 더주는, C:쿠폰팩, U:U+결합할인}`, `N`/빈칸=없음 |
| `salesBadge` | 딱지. `C`=U+결합할인 대상, `A10`=매월 10GB 추가, `P`=쿠폰팩, `N`=New, `B`=BEST, `DR`=요금인하 |
| `directPromotionDirectmallPrice` | **다이렉트몰에서 실제 내는 값** (부가세 포함) |
| `directPromotionInfotext` | ⭐ `A` = 화면에 「**평생요금**」. 그 밖 = 「N개월 후 M원」 |
| `directPromotionAfterMonthChk` / `…AfterPrice` | 특가 달수 / 특가 끝난 뒤 값 |

### ⭐ 특가 판정 — 여기가 이 계열의 핵심이고, 다행히 원문이 스스로 말한다

kt엠모바일과 달리 **기간을 지어낼 일이 없다.** 사이트가 값 옆에 딱지를 직접 붙인다.

- `directPromotionInfotext === 'A'` → 화면 딱지 「평생요금」
  → `monthlyFee` = `directPromotionDirectmallPrice`, `promo` = `null`.
  (유의사항에도 「7개월간 추가할인 프로모션이 **적용될 경우**」라고만 적혀 있어, 딱지가 「평생요금」이면 기간 할인이 아니다.)
- 그 밖 → 화면 딱지 「N개월 후 M원」
  → `monthlyFee` = `directPromotionAfterPrice`(M), `promo` = `{months: N, feeDuring: directPromotionDirectmallPrice}`.
  2026-09-01 현재 유심 144개 중 6개가 여기 해당하고 **전부 7개월**이다.

**부가세**: 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다.」 → 담은 값은 전부 부가세 포함 표시가.

## 담지 않은 것 (DECIDED 기준) — 빠뜨린 게 아니다

| 무엇 | 몇 개 | 어떻게 알아보나 |
|---|---|---|
| 패드(태블릿) 요금제 | 9 | `dedicatedPriceGubun === 'T'` (「헬로 패드 USIM …」·「데이터플러스 …」·「데이터 유심 …」) |
| 청소년·키즈 전용 | 7 | `dedicatedPriceGubun === 'J'` |
| 시니어 전용 | 3 | `dedicatedPriceGubun === 'S'` |
| 복지 대상 전용 | 2 | 이름에 「복지」 (분류 딱지는 `N`이라 이름으로만 잡힌다) |
| 일 단위 데이터 | 5 | 월 제공량이 빈칸이고 `dedicatedDailyOfferValue` 만 있다 (「… 일5GB」) |
| **휴대폰(기기) 요금제 전체** | 143 | `reqRateType=P`. 가입조건이 「LTE 휴대폰을 신규 또는 기기변경 가입 시」 = 단말결합 |

→ 유심 144개 중 **118개**를 담았다. 자세한 근거는
`sources/hello-phone-plans-2026-09-01-excluded.md` 와 각 요금제의 `-excluded.md` 스냅샷에 있다.

## 다시 찍는 법

```bash
node scripts/fetch-hello-plans.mjs      # src/data/plans/hello.json 다시 만든다
node scripts/fetch-hello-snapshots.mjs  # sources/*.md 스냅샷 (이미 있는 파일은 안 건드린다)
npx vitest run && npx tsc -b            # 검사
```

## 뒤진 곳 (다음 사람이 다시 뒤지지 않게)

- `direct.lghellovision.net/rate/rateService.do`, `/rate/benefit.do`, `/rate/combine.do` — 요금제 목록이 아니라
  부가서비스·혜택·결합 안내 화면이다. 요금제 값은 없다.
- `/m/rate/rateViewUsim.do` (모바일 화면) — 같은 `fund/ajaxRateList.do` 를 부른다. 새 값 없음.
- 요금제 **상세 페이지 URL은 없다.** 카드를 누르면 `openPop()` 이 목록 데이터로 그 자리에서 창을 그린다.
  그래서 요금제별 원문 링크를 만들 방법이 없다(위 검색창 시험도 실패).
- `directcdn.lghellovision.net/web/js/content.js` — 화면 글자 만드는 함수들(`fnCallSmsNm` 등)이 여기 있다.
  `통화 = 분`, `문자 = 건` 인 것을 여기서 확인했다.
- 스마트초이스는 접근 금지라 대조하지 않았다.
