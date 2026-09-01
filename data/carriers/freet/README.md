# 프리티 (프리텔레콤) — 길 지도

갈래 `lane-big1`이 2026-09-01 뚫음. **대형 독립 알뜰폰, SKT·KT·LGU+ 3망 전부.**
회사: (주)프리티(KOSPI 006490) + 자회사 프리텔레콤. 사이트가 스스로 「국내에서 유일하게 통신 3사의 알뜰폰(MVNO) 서비스를 제공」이라고 적는다.

- 공식 다이렉트몰: **https://www.freet.co.kr** (푸터 「COPYRIGHT (C) FREETELECOM」, 사업자 링크 (주)프리티 — 공식 도메인 확인함)
- 값 서버: **https://api.freet.co.kr** (페이지 안 `API_DOMAIN = "https://api.freet.co.kr"`)
- 요금제 목록 화면: `/plan/ratePlan/list` (= `/plan/ratePlan`, `/plan/udirectPlan/list`도 같은 화면)
- 요금제 상세 화면: `/plan/ratePlan/detail?svcCd=<svcCd>` ← **sourceUrl로 이걸 쓴다**

## 통로 (내부 API — 세션·쿠키·로그인 없이 동작 확인)

### 1. 목록

```
GET https://api.freet.co.kr/plan/v1/list?rowSize=20&pageNo=<1..10>&onlineAuth=Y
Referer: https://www.freet.co.kr/plan/ratePlan/list
```

- ⚠️ **`rowSize`는 20이 상한이다.** 500을 넣어도 20개만 준다(`totalCount`는 195로 제대로 나옴). 반드시 `pageNo`로 돌린다.
- `onlineAuth=Y`는 화면(`plan.list.js`)이 **항상** 붙이는 값 — 「지금 온라인 가입 가능」 목록이다.
- 응답: `data.totalCount`, `data.ratePlans[]`.
- 필터 파라미터(화면이 쓰는 것): `comTypes` `genCds` `svcTypes` `dataMin/Max` `callMin/Max` `feeMin/Max` `hashTags` `order`.

### 2. 상세

```
GET https://api.freet.co.kr/plan/v1/detail?svcCd=<svcCd>
```

- 목록에 없는 것: `svcDesc`(프로모션 문구), `infoSubList[]`(안내사항 원문 HTML), `discountConditionDesc`(할인 유지 조건), `svcTypeCd`.
- 상세 **화면**은 이 API를 jsrender로 그린다 — HTML만 `curl` 하면 본문이 비어 있다.

### 3. 그밖에

- `GET /plan/v1/hastag/list` — 해시태그 목록
- `GET /global/v1/getBannerAjax?bnnrDiv=RATE_PLAN_MENU` — 배너

## 값 필드 — ⚠️ 함정

| 필드 | 뜻 |
|---|---|
| `svcCd` | 요금제 코드 (PC0SB00255, DDH15G_1M, FTDP312 …). **id에 쓴다** (`_`→`-`, 소문자) |
| `comType` | **망**: `freeS`=SKT, `freeC`=KT, `freeT`=LGU+ (목록 화면 필터 `<span name="comTypes" key="freeS">SKT</span>`가 근거) |
| `genCd` | `LTE` / `5G` — 195개 전부 둘 중 하나. 「통합」 값은 없다 |
| `svcType` | `후불`(183) / `선불`(12). 선불은 **충전식**이다(안내에 「사용기간」·「재충전」) |
| `freeData` | `월15GB` / `월300MB` / `월11GB+매일2GB` / `매일5GB` / `월7GB+추가10GB` |
| `qos` | 소진 후 속도 `1Mbps` `3Mbps` `5Mbps` `10Mbps` `400kbps`, 없으면 null |
| `freeVoice` | `기본제공`(=무제한) 또는 `300분`. `freeSms`도 같은 꼴 |
| `basicFee` | **정가** |
| `monthlyFee` | **지금 내는 값** (특가 중이면 특가값) |
| `periodDiscMonth` / `periodDiscAmt` | 특가 달수 / 특가 할인액 |
| `foreverDiscAmt` | **평생 할인액** — 특가가 끝난 뒤에도 계속 빠지는 금액 |

### 요금 세 층을 화면이 만드는 식 (원문 템플릿)

목록 `#planListContentBoxTmpl`:

```
{{if (foreverDiscAmt + periodDiscAmt) > 0}}<del>월 {{:basicFee}}원</del>{{/if}}
월 <strong>{{:monthlyFee}}</strong>원
{{if periodDiscMonth && periodDiscMonth != '0'}}{{:periodDiscMonth}}개월 후 {{:basicFee-foreverDiscAmt}}원{{/if}}
```

상세 배지:

```
{{if periodDiscMonth > 0}}{{:periodDiscMonth}}개월 할인{{/if}}
{{if foreverDiscAmt > 0 && (periodDiscAmt == 0 || periodDiscAmt == null)}}평생 할인{{/if}}
```

**⇒ 우리 스키마로 옮기는 법 (195개 전부에서 항등식 확인, 불일치 0건):**

| 원문 | `monthlyFee` | `promo` |
|---|---|---|
| `periodDiscMonth > 0` (배지 「N개월 할인」) | `basicFee − foreverDiscAmt` (= 화면의 「N개월 이후 …」) | `{ months: periodDiscMonth, feeDuring: monthlyFee }` |
| `periodDiscMonth == 0`, `foreverDiscAmt > 0` (배지 「평생 할인」) | `monthlyFee` (= `basicFee − foreverDiscAmt`) | `null` |
| 할인 없음 | `basicFee` | `null` |

⚠️ **`basicFee`를 그대로 `monthlyFee`에 넣으면 안 된다.** 특가가 끝나도 정가로 돌아가지 않는다 —
「평생 할인」이 남아 있어서 화면이 「7개월 이후 25,300원」(정가는 41,800원)이라고 적는다.

### 부가세 · 약정

안내사항 원문(모든 요금제 공통):

> 프리티의 모든 요금제는 위약금이 없는 **무약정** 요금제 입니다.
> 온라인몰에서만 가입 가능한 전용 요금제이며, 프리티의 **모든 요금제 기본료는 부가세가 포함된 금액**입니다.
> 해당 요금상품은 **신규/번호이동 고객만** 가입 가능하며, 기존 프리티 고객은 해당 상품으로 요금변경이 불가 합니다.

### 「+추가NGB」는 상시가 아니다

`freeData`가 `월7GB+추가10GB` 꼴인 요금제 11개. 상세의 `svcDesc`가 답을 준다:

> [프로모션] **24개월간** 데이터 10GB 추가 제공됩니다.

→ `dataGB`에는 **기본량만** 담았다(적게 세는 쪽). 추가분은 memo에.

## 안 담은 것 (2026-09-01 · 195개 중 53개)

| 왜 | 몇 개 | 근거 |
|---|---|---|
| 일 단위 데이터 (`월11GB+매일2GB` 29 · `매일5GB` 5 · `월10GB+매일2GB` 1) | **35** | DECIDED 2026-09-01 「일 단위 데이터 요금제는 1차에서 안 담는다 — 스키마에 그릇 없음」 |
| 선불(충전식) | **12** | 후불 월정액이 아니다. 안내에 「사용기간」·「재충전」·「충전잔액」. ⚠️ 총괄 판정 필요 |
| 복지 요금제 (3망 각 1개) | **3** | 상세 「복지 요금제 안내」 — 장애인·국가유공자·기초생활수급자·차상위계층·복지단체만 |
| 패드·태블릿 전용 (`DDHDATA20G` `DDHDATA10G`) | **2** | `svcDesc` 「패드 및 태블릿 기기 전용! *일반 휴대폰기기에서 사용 불가」 |
| 해외 듀얼플랜 전용 (`FTDP283` KR Basic) | **1** | 「프리티 캐나다 듀얼플랜에 가입하시면 KR Basic 요금제를 무료로 사용」 — 단독 상품이 아니다 |

**3G 전용은 없었다.** 연령 전용(청소년·시니어)도 없었다 — 195개 이름·안내사항 전문을
`청소년/시니어/어르신/키즈/유학/외국인/실버/주니어/청년/워치/웨어러블` 로 훑어 나온 것은 위 표가 전부다.

## 뒤진 곳 (다음 사람이 다시 안 파도 되게)

- `/charge/fee/main`, `/charge/data/main` — **요금제가 아니다.** 「선불 요금 충전」 화면이다.
- `/plan/ratePlan/main`, `/plan/udirectPlan/main` — 404.
- `/static/js/plan/plan.list.js` (목록 로더), `/static/js/plan/plan.detail.js` (상세 로더) — 통로는 여기서 찾았다.
- 목록 페이지 HTML 안에 jsrender 템플릿(`<script type="text/x-jsrender">`)이 통째로 들어 있다 — **값 해석 규칙의 원문**이다.
- 화면 확인은 playwright headless로 `/plan/ratePlan/detail?svcCd=…` 두 개를 실제로 렌더해서 눈으로 봤다
  (스냅샷 `sources/ddh15g-1m-2026-09-01-promo-period.md`, `sources/ftdp149-2026-09-01-forever-discount.md`).

## 다시 뜨는 법

```
node scripts/fetch-freet-plans.mjs <출력폴더>
```

원본만 내려받는다. `src/data/plans/freet.json`은 사람이 위 규칙으로 판정해 만든다.
