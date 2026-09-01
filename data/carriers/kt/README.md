# KT — 원문 길

- 시작점: `https://product.kt.com/wDic/index.do?CateCode=6002` (KT닷컴 모바일 요금제)
- 상태 (2026-09-01): **길 뚫림.** 목록은 ajax 조각으로 그냥 받아지고, 값(월정액·데이터·음성·문자)은
  상세 페이지의 **「요금안내」 표**에 있다. 스크립트: `scripts/fetch-kt-plans.mjs`
- 스냅샷 규칙: `sources/<요금제id>-<YYYY-MM-DD>-<목적>.md` — 덮어쓰지 않는다.

## ⭐ 길 (2026-09-01 뚫음)

### ① 목록 — playwright 없이 그냥 받아진다

목록 **페이지**(`index.do`)는 정적 HTML에 「총 0건」만 있지만, 그 페이지가 부르는 ajax는 쿠키 없이도 열린다.

```
GET https://product.kt.com/wDic/getOptionItemListAjax.ajax
      ?cate_code=6002&pageNo=1&listSize=100&filter_code=<탭>&option_code=
GET https://product.kt.com/wDic/getOptionItemTotalCountAjax.ajax?filter_code=<탭>&option_code=
```

`filter_code`(화면의 탭). 2026-09-01 기준 개수:

| filter_code | 탭 | 묶음 수 |
|---|---|---|
| 186 | 통합요금제 | 5 |
| 187 | 온라인전용(요고) | 1 |
| 188 | 키즈/외국인 | 2 |
| 189 | 태블릿/스마트워치 | 3 |
| 190 | 기타 | 23 |
| 191 | 전체 | 34 |

⚠️ **목록 한 줄 = 요금제 하나가 아니다.** 「묶음(요금제 그룹)」이다. 예: 「베이직」 한 줄 안에
실제 요금제가 14개 들어 있고, 목록에 보이는 「월 28,900원~」은 **묶음 최저가**다. 그대로 쓰면 안 된다.

### ② 값 — 상세 페이지의 「요금안내」 표

```
https://product.kt.com/wDic/productDetail.do?ItemCode=<코드>&CateCode=6002
```

- 이 페이지도 정적 HTML엔 표가 없다. 표가 오는 길이 **두 갈래**다:
  - (a) `productDetail.do` HTML 안 `htmlUploadType_<타임스탬프>.html` 파일명을 찾아
    `https://product.kt.com/static/prodetail/<ItemCode>/web/htmlUploadType_*.html` 를 받고,
    그 안 `<script src=".../js/data/w_*_data*.js">` 의 `window.dev.ui.ageBenefit.DATA.base.tableHTML`
    → **표 HTML이 문자열로 통째로 들어 있다.** (초이스·초이스 더블·베이직·베이직(이월))
  - (b) 그런 data js가 없는 묶음(요고·음성)은 **렌더 후 DOM에서** 긁어야 한다 → playwright.
- 그래서 `scripts/fetch-kt-plans.mjs` 는 (b)로 통일했다 — playwright로 렌더해서 `<table>` 을 다 긁는다.
- 묶음 안 요금제 이름·월정액은 `productDetail.do` 원본 HTML의 `selectGroupItem('...','...')` 인자에도
  그대로 있다(요고에서 확인). 표와 교차 대조에 쓴다.
- 아코디언 본문(데이터/음성/문자/가입 유의사항)은
  `/static/prodetail/<ItemCode>/web/itemAccordion/html/accordion_<타임스탬프>.html` —
  파일명은 `productDetail.do` HTML의 `fn_getItemAccordionInfo(...)` 인자에 있다.
  **가입 자격 제한(연령·국적)은 여기 「가입 및 유의사항」에만 적혀 있다.**

### ③ 교차 대조 — 스마트초이스

`scripts/fetch-smartchoice-list.mjs` 의 `mnoPlanList` 중 `TEL_NAME == "KT"` (2026-09-01 기준 126건).
요금·데이터·음성·문자를 KT닷컴 표와 맞춰봤고 전부 일치했다. 다만 스마트초이스에는
**요고(온라인 전용)가 아예 없다** — 온라인 전용은 KT닷컴에서만 얻는다.

## ⚠️ 이 계열에서 걸린 것

### 5G/LTE 구분이 원문에 없다 (총괄 판정 필요)

KT의 현행 라인업(초이스·베이직·음성)은 **「통합요금제」**다. 상세 페이지 배너 문구가
「요금제는 하나로, 혜택은 알아서 덤으로 **5G/LTE 구분없이** …」이고,
스마트초이스의 `PLAN_TYPE_NAME`도 `5G`/`LTE`가 아니라 **`통합`**이다.
요고(온라인 전용)는 페이지 어디에도 5G/LTE 표기가 없다.

스키마 `generation`은 `'5G' | 'LTE'` 둘뿐이라 **담을 칸이 없다.**
지금은 전부 `generation: "5G"` 로 담고, 요금제마다 `memo`에
「원문은 통합(5G/LTE) — 스키마에 값이 없어 5G로 담음(총괄 판정 필요)」를 박아 뒀다.
스키마에 `'통합'`을 넣을지는 총괄이 정한다.

### monthlyFee = 공시 정가

KT 화면엔 값이 셋 나란히 뜬다 — 원문 그대로면 **월정액**만 정가다.

- `월 90,000원` ← **이걸 담는다** (부가세 포함. 원문 「부가세가 포함된 실제 지불금액입니다.」)
- `선택약정 할인 시 67,500원` ← 25% 선택약정. **담지 않는다** (총괄 결정)
- `7% 다이렉트 요금할인 시 61,200원` ← 다이렉트샵에서 단말 구매/유심 가입해야 붙는 조건부 할인.
  기간이 아니라 **가입 경로** 조건이라 `promo`(기간 한정)에도 안 맞는다. 담지 않았다.

### 담지 않은 것

- **연령·자격 전용 8개**: 키즈(키즈38/28/24/20/13 — 어린이 전용) 5개,
  웰컴(웰컴5/3/1) 3개 — 웰컴은 아코디언 원문 「본 요금제는 외국인등록증을 소지한
  국내 장기 체류 외국인 한정 가입 가능합니다.」
  (덤 혜택 = 스쿨덤/Y덤/65+덤/75+덤은 **가입 제한이 아니라 자동 추가 혜택**이므로 제외 사유가 아니다.
  스마트초이스가 이걸 별도 요금제로 세어 KT 126건이 되지만, KT 공시상 같은 요금제다.)
- **휴대폰 회선이 아닌 것**: 스마트기기·데이터투게더·듀얼번호 (filter 189)
- **3G 전용**: filter 190의 순 완전무한/순 모두다올레/표준/신 표준/슬림/Style/알스마트/알캡/
  골든스마트/손말/복지15000/3G 효/키즈 알115/순 데이터/Wearable/키즈 80 등.
  스키마 `generation`에 `3G`가 없고 수집 범위(5G·LTE)에서도 벗어난다.
- **선불(prepaid)**: LTE 선불(1036) · 3G 선불(1038) · 선불 35,000(1612) — 월정액 개념이 없다.

## 뒤진 곳 (길이 막혔던 기록)

- `https://help.kt.com/serviceinfo/SearchTermsList.do` (이용약관 원문으로 5G/LTE 분류를 확인하려 했다)
  → **「등록되지 않은 페이지 입니다.」** 404. KT 이용약관 목록 URL을 다시 찾아야 한다.
- `productDetail.do` 를 curl로 받으면 본문이 비어 있다(제목만). 위 ②의 두 갈래로만 값을 얻는다.
- 상세 페이지의 「요금안내」 표는 연령 탭(기본제공/스쿨덤/Y덤/65+덤/75+덤)이 있다.
  data js의 `DATA.base` 가 **기본제공(일반)** 이다. `school`/`y`/`senior` 는 연령 덤이라 쓰지 않는다.
