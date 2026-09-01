# LG유플러스 — 원문 길

- 시작점: `https://www.lguplus.com/mobile/plan/mplan/5g-all` → **`/mobile/plan/mplan/plan-all`로 넘어간다**
  (5G/LTE를 가르던 옛 주소는 없어졌다. `/mobile/plan/mplan/lte-all`도 같은 곳으로 넘어간다.)
- 상태 (2026-09-01, LGU+ 갈래): **길 뚫음.** 아래 ①②③이 실제로 쓴 길.
  수집 스크립트: **`scripts/fetch-lgu-plans.mjs`** (저장소 뿌리에서 `node scripts/fetch-lgu-plans.mjs`)
  → 원자료 스냅샷 `data/carriers/lgu/raw/lgu-<날짜>.json`, 요금제마다 `sources/<id>-<날짜>-collect.md`
- 스냅샷 규칙: `sources/<요금제id>-<YYYY-MM-DD>-<목적>.md` — 덮어쓰지 않는다.

## ① 목록 — 「통합」 탭 (DOM 긁기)

`https://www.lguplus.com/mobile/plan/mplan/plan-all` 을 **playwright로 렌더**한다
(`waitUntil:'networkidle'`은 광고·추적 요청 때문에 **영원히 안 끝난다** → `domcontentloaded` + 8초 대기).

- 요금제 한 줄 = `a.mobile-planList-link`. 접힌 아코디언 안에도 **DOM은 이미 다 들어 있다**(펼칠 필요 없음).
  - 이름 `.mobile-planList-th` · 요금 `.mobile-planList-td--price`
  - 데이터 `.--td01` · 음성 `.--td02` · 문자 `.--td03`
  - 상세 링크 `href` = `/mobile/plan/mplan/5g-all/<분류>/<요금제코드>`
- ⚠️ 같은 요금제가 「위 요약 구좌」와 「아코디언 안」에 **두 번** 나온다 → `href`로 하나만 남긴다.
- 하위탭(`.plan-sub-tab-menu a`)은 **클릭해야** 갈린다: 전체 / 키즈 / 청소년 / 청년(유쓰) / 시니어 /
  외국인(Global) / 외국인 청년(Uth) / 복지 / **LTE**.
  - 2026-09-01 기준 개수: 전체 18 · 키즈 13 · 청소년 13 · 청년 12(부가서비스 1 포함) · 시니어 5 ·
    Global 7 · Uth 7 · 복지 13 · **LTE 4**
  - 즉 **LTE 탭이 지금 LGU+가 신규로 받는 LTE 요금제 전부**다(4개).

## ② 목록 — 「온라인 가입 전용」 탭 (내부 API — 여기가 제일 깔끔하다)

```
POST https://www.lguplus.com/uhdc/fo/prdv/mblppexhi/v2/list:get
content-type: application/json
x-user-agent-type: PC
{"menuId":"M20162","ppSortType":"SALE_ASC","ageGrpCd":"","mblPpExhiFilterCondList":[]}
```

- 쿠키·로그인 없이 그냥 된다. 2026-09-01 기준 **12개**(너겟 11 + LTE 다이렉트 22 1).
- `menuId`는 `GET /uhdc/fo/fcmm/fome/v1/meid?menuLinkUrl=<경로>`로 얻는다
  (`/mobile/plan/mplan/direct` → **M20162**, `/mobile/plan/mplan/plan-all` → M21311).
- 쓸 칸: `urcMblPpCd`(코드) `urcMblPpNm`(이름) `urcPpBasfAmt`(정가) `finalDcntAmt`(할인 반영가)
  `mblMcnPpPmtnDcntAmt`(할인액) `ppMapgPmtnNm`(프로모션명) `urcMblProdPpKndNm`(5G/LTE)
  `urcMblProdPpDivsNm`(일반/…) `mblPpExhiMajrInfoList`(데이터·음성·문자 원문)
  `mblPpExhiMenu.menuUrl`(상세 경로 조각)
- 상세 URL 만드는 법: `https://www.lguplus.com/mobile` + `mblPpExhiMenu.menuUrl` + `/` + `urcMblPpCd`
  예) `/plan/mplan/direct/nerget` + `LPZ1004907` → `.../mobile/plan/mplan/direct/nerget/LPZ1004907`

## ③ 값의 최종 근거 — 요금제 상세 페이지 (렌더 후 DOM)

- 이름 `.plan-title` · 딱지 `.plan-flag__item`
- **머리줄 `.plan-features__item` 3개 = [음성, 문자, 망(5G|LTE)]** ← 세대 판정은 여기서
- **월정액 `.price-summary`** (예: "월정액 61,000원") · `.price-discount__text`("부가세 포함")
- 선택약정 안내 `.price-discount__price` (예: "약정 할인 시 45,750원") ← **담지 않는다**
- 제공량 `.plan-info .plan-list__item` 의 `dt.plan-list__title` / `dd.plan-list__text`
  (데이터 · 공유 데이터 · 스마트기기 · 멤버십 혜택 · 맞춤형 혜택 …)
- 연령/복지 변종 목록: `.premium-list__item` (a href = 각 변종 상세)
  또는 API `GET /uhdc/fo/prdv/mblppexhi/v2/<코드>/segments?urcHposMblPpCd=<코드>`
  → `segment.pricePlanAttributeItemNm`(일반/키즈·청소년/청년(유쓰)/시니어/외국인/복지) +
    `sectionMinimumValue`~`sectionMaximumValue`(나이 구간)

## ④ ⭐ 연령 변종 — segments API가 정답이다 (2026-09-01 라운드 2에서 넓힘)

```
GET https://www.lguplus.com/uhdc/fo/prdv/mblppexhi/v2/<기준코드>/segments?urcHposMblPpCd=<기준코드>
x-user-agent-type: PC
```

- ⚠️ **넣는 코드는 「전체」 탭의 기준 요금제 코드**여야 한다(예 `Z202606000` = 데이터플랜9GB).
  **연령 변종 코드(`LPZ…`)를 넣으면 빈 배열 `[]`**이 온다. 이거 몰라서 한참 헤맸다.
- 한 번 부르면 그 요금제의 **모든 세그먼트가 한꺼번에** 나온다 —
  `pricePlanCd` · `pricePlanNm` · `segment.pricePlanAttributeItemNm`(일반/키즈/청소년/키즈·청소년/청년(유쓰)/시니어/복지/외국인/표준) ·
  `sectionMinimumValue`~`sectionMaximumValue` · **`majors[]`(데이터·공유 데이터·음성통화·문자메시지 원문)** · `menu.menuUrl`.
  → `majors`만 있으면 **상세 페이지를 렌더하지 않고도** 제공량을 다 얻는다(DOM 긁기보다 훨씬 빠르고 안 깨진다).
- 상세 URL: `https://www.lguplus.com/mobile` + `menu.menuUrl` + `/` + `pricePlanCd`
- ⭐ **①의 하위탭 DOM 긁기는 빠뜨린 게 있었다.** `데이터플랜MAX(청소년)`(LPZ1006738)은
  라운드 1의 「청소년」 탭 스크랩 13개에 없었는데 segments엔 `disabled: false`로 멀쩡히 있다
  (렌더로 확인: 월정액 85,000원·데이터 무제한). **연령 변종을 셀 땐 탭이 아니라 segments를 센다.**

2026-09-01 기준 세그먼트별 나이 구간(⚠️ `sectionMaximumValue`는 **여닫이가 일정하지 않다** — 아래 ⑤로 확인할 것):

| 세그먼트 | 나이 구간(API) | 요금제 수 |
|---|---|---|
| 키즈 | 4~13 | 5 |
| 청소년 | 13~19 | 5 |
| 키즈/청소년 | 4~18 | 9 (MAX·150GB~14GB) |
| 청년(유쓰) | 19~35 | 11 |
| 시니어 | 65~null | 5 |
| 복지 / 외국인(Global) / 외국인 청년(Uth) / 표준 | null 또는 19~35 | (나이 조건이 아니라 담지 않음) |

## ⑤ ⭐ 나이 문구 원문은 어디 있나

**API의 숫자 구간만 보면 안 된다** — `키즈 4~13`과 `청소년 13~19`처럼 경계가 겹쳐서
`sectionMaximumValue`가 포함인지 미만인지 알 수 없다. **글자로 적힌 곳 두 군데를 본다.**

1. **상세 페이지 「데이터 안내」 표의 머리글** (렌더한 HTML에 `<th>`로 있다. 여기가 제일 또렷하다):
   > 일반 (만 19세~64세) | 키즈 (**만 4세~12세**) | 청소년 (**만 13세~18세**) | 청년(유쓰) (**만 19세~34세**) | 시니어 (**만 65세 이상**) | 복지 | 외국인 청년(Uth) (만 19세~34세 외국인)
2. **「맞춤형 혜택 안내」 표의 「혜택 적용 조건」**:
   > 「만 4세 이상 만 13세 미만 고객이 대상 요금제 가입 시」 · 「만 13세 이상 만 19세 미만 고객이 청소년 혜택 대상 요금제 가입 시」 ·
   > 「만 19세 이상 만 35세 미만 고객이 유쓰 혜택 대상 요금제 가입 시」 · 「만 65세 이상 고객이 시니어 혜택 대상 요금제 가입 시」

→ **`sectionMaximumValue`는 「미만」이다.** 유쓰 19~35 = 만 19세~34세. 키즈 4~13 = 만 4세~12세.
   단 **「키즈/청소년」(4~18)만 예외로 「이하」**다 — 그 요금제들의 페이지 「연령대」 분류가 「만18세 이하」로 적혀 있다.

- LTE 연령 요금제는 **이름과 유의사항에 직접** 적혀 있다:
  「LTE 키즈 22(**만 12세 이하**)」 · 「**만 4세부터 만 12세까지** 본인 명의 휴대폰번호 1개에서만 키즈 요금제에 가입할 수 있어요.」
  「**시니어 요금제는 만 65세 이상만 가입할 수 있어요.**」
- ⚠️ **렌더 후 `document.body.innerText`엔 이 표들이 안 잡힌다**(1,500~2,500자밖에 안 나온다).
  `page.content()`로 **HTML을 통째로 받아** `<table>`을 파싱해야 한다.
- ⚠️ **상세 페이지에서 버튼·링크를 무턱대고 클릭하면 안 된다** — 「현역병사혜택」 같은 딴 페이지로 튄다.
  아코디언을 펼칠 필요 없이 **HTML에 이미 다 들어 있다.**

## 이번에 담은 것 / 뺀 것 (2026-09-01)

- **담음 31개** = 통합 탭 18(전부 5G) + 너겟 11(5G) + LTE 다이렉트 22 + LTE 표준 요금제
- **연령·대상 전용 62개 제외** (키즈·청소년·청년(유쓰)·시니어·외국인(Global)·외국인 청년(Uth)·복지
  변종 60개 + LTE 탭의 `LTE 키즈 22`·`LTE 시니어 16.5`)
  → ⭐ **2026-09-01 라운드 2에서 이 중 37개를 담았다.** 아래 「라운드 2」 항목 참고.
- 부가서비스 1개 제외: `유쓰 공유 데이터(60GB)` — 요금제가 아니라 `/mobile/plan/addon/…`
- 일 단위 데이터라 스키마에 그릇이 없어 제외 1개: `현역병사 데이터 33`
  (원문 "월2GB+매일2GB +다 쓰면 최대 3Mbps". 현역병사 전용이기도 하다)
  → 라운드 2에서 그릇(`dailyDataGB`)은 생겼지만 **현역병사 전용**이라 계속 뺐다(아래 「라운드 2」 참고).

## 원문이 애매한 곳 (총괄이 판정할 것)

- **선택약정(25%)**: 상세 페이지가 「약정 할인 시 45,750원」처럼 **할인가를 같이 보여준다**.
  우리는 `monthlyFee`에 **공시 정가(월정액, 부가세 포함)**만 담았다. 할인가는 담지 않았다.
- **너겟·다이렉트 페이지엔 「부가세 포함」 문구가 없다.** 월정액만 적혀 있다(예: 너겟65 = 월정액 65,000원).
  무약정 상품이라 「약정 할인 시」 줄도 없다.
- **「프로모션 적용가」**: 내부 API가 `너겟65 → 53,800` `너겟59 → 43,300` `LTE 다이렉트 22 → 20,000`
  을 준다. 그런데 **몇 개월인지·언제까지인지 원문 어디에도 없다** → 스키마 `promo.months`를 채울 수
  없어 전부 `promo: null`로 두었다.
- **`데이터플랜`의 「일반」 세그먼트는 원문에 「만 35세 ~」로 적혀 있다** (35세 미만은 같은 값의
  「유쓰」 변종으로 안내된다). LGU+ 자신이 `urcMblProdPpDivsNm = "일반"`으로 부르고 「전체」 탭에
  올려 두었기에 **일반 가입 요금제로 담았다.** 뒤집을지는 총괄 판정.
- **`LTE 표준 요금제`**: 데이터 "1KB당 0.275원", 음성 "1초당 1.98원" = **기본 제공 없음(종량)**.
  `dataGB: 0`, `voiceMinutes: 0`으로 담고 `memo`에 원문을 적어 두었다.

## 뒤진 곳 (길이 막혔던 기록)

- `POST /uhdc/fo/prdv/mblppexhi/v2/list:get` 에 **통합 탭 menuId(M21311)**를 넣으면
  `pricePlanList: []` — **빈 목록**이 온다. 통합 탭은 이 API가 아니라 **전시(display) 구좌**로 그려진다.
- 통합 탭의 전시 구좌 API `GET /uhdc/slit/display/v1/corner/PC_MobilePlanList_All?osType=ALL&channelType=PC`
  는 배너·아코디언 껍데기만 준다 (`contentDetails[].pricePlan`이 전부 `null`). → 요금제 값은 안 나온다.
  결국 **①처럼 렌더된 DOM을 긁는 게 통합 탭의 유일한 길**이다.
- `/mobile/plan/mplan/5g-all`, `/mobile/plan/mplan/lte-all` 은 **둘 다 `/plan-all`로 리다이렉트**된다.
- `GET /uhdc/fo/fcmm/fome/v1/meid?menuLinkUrl=/mobile/plan/mplan/5g-all` → **빈 응답**(메뉴가 없음).
- 정적 HTML(WebFetch/curl)엔 요금제가 하나도 없다 — 전부 자바스크립트 렌더 뒤에 생긴다.
- 너겟 전용 사이트(nugget.lguplus.com)는 뒤지지 않았다 — 「온라인 가입 전용」 탭이 너겟을 다 덮는다(12개).

## 스마트초이스 대조

- 스마트초이스 발견 목록의 LGU+ 요금제: `../smartchoice/sources/planlist-*-discovery.json`의
  `mnoPlanList`에서 `TEL_NAME == "LGU+"`. (2026-09-01 현재 그 파일은 아직 없다 — 총괄 몫)

## 2026-09-01 라운드 2에서 담은 것 (연령 전용, 37개)

| 묶음 | 개수 | ageMin~ageMax | 원문 근거 |
|---|---|---|---|
| 키즈 (5G) | 5 | 4~12 | 「키즈 (만 4세~12세)」 |
| 청소년 (5G) | 5 | 13~18 | 「청소년 (만 13세~18세)」 |
| 키즈/청소년 (5G, MAX·150GB~14GB) | 9 | 4~18 | 「연령대」 분류 「만18세 이하」 + segments 4~18 |
| 청년(유쓰) (5G) | 11 | 19~34 | 「청년(유쓰) (만 19세~34세)」 |
| 시니어 (5G) | 5 | 65~ | 「시니어 (만 65세 이상)」 |
| LTE 키즈 22 · LTE 시니어 16.5 | 2 | 4~12 · 65~ | 요금제 이름·유의사항에 직접 |

- **월정액은 연령 변종도 기준 요금제와 똑같다** (예: 데이터플랜9GB 계열은 어느 연령이든 47,000원).
  달라지는 것은 **제공량**이다 (9GB → 키즈 10GB / 청소년 11GB / 시니어 12GB / 유쓰 15GB).
- 값은 **segments API의 `majors`**로 담고, **라운드 1의 DOM 스크랩(`raw/lgu-2026-09-01.json`)과 한 줄씩 교차 대조**해 전부 일치했다.
  (`데이터플랜MAX(청소년)`만 라운드 1에 없어 상세 페이지를 따로 렌더해 확인 — 85,000원·무제한.)
- 음성이 「기본제공/무제한」이 아닌 줄만 분 수를 담았다: 300MB·750MB(청소년) 계열 125분,
  LTE 키즈 22 = 60분(원문 「60분 +지정번호 2개(망내) 음성통화 무제한」 → 일반 제공량만),
  LTE 시니어 16.5 = 100분. **시니어 변종은 음성이 무제한으로 바뀐다**(300MB·750MB 기준 요금제는 125분).

### 여전히 안 담은 것 (라운드 2)

- **복지 13개** — 「복지 카드를 소지한 고객이 …」. 나이가 아니라 **자격 조건**이다.
- **외국인(Global) 7 · 외국인 청년(Uth) 7** — 국적 조건(Uth는 「만 19세 이상 만 35세 미만 **외국인** 고객」).
- **표준 세그먼트** — 나이 조건이 아니다(요금 구조 변종).
- **`현역병사 데이터 33`** (LTE 탭, `LPZ0002506`, 33,000원) — 원문 「월2GB+**매일2GB** +다 쓰면 최대 3Mbps」.
  ⭐ 3사 중 **유일한 `dailyDataGB` 후보**지만 **현역 병사 전용**(입영 통지서·복무 확인서 등 서류 제출)이라
  나이 조건이 아니어서 담지 않았다. 그릇(`dailyDataGB`)은 비어 있다.
- **`유쓰 공유 데이터(60GB)`** — 요금제가 아니라 부가서비스(`/mobile/plan/addon/…`). 라운드 1과 같음.
