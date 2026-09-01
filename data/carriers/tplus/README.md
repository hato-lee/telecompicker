# 티플러스 (tplus / 한국케이블텔레콤) — 길 지도

갈래 `lane-big1`이 2026-09-01 뚫음. **대형 독립 알뜰폰, SKT·KT·LGU+ 3망 전부.**
회사: 한국케이블텔레콤(KCT) — 케이블방송사업자(SO)들이 공동출자한 태광그룹 계열.

- 공식 사이트: **https://www.tplusmobile.com**
  (공식 확인 근거: 푸터의 「패밀리 사이트」가 한국케이블텔레콤·티플로·태광산업·흥국생명 등 **태광그룹 계열사**를 줄줄이 걸고 있고,
  고객센터 안내가 「자사폰 114」다. 검색으로 후보를 찾은 뒤 이 두 가지로 공식 도메인임을 확인했다.)
- 요금제 목록 화면: `/main/rate/join`
- 요금제 상세 화면: `/main/rate/plan_details?seq=<seq>` ← **sourceUrl로 이걸 쓴다**

## 통로 (내부 ajax — 세션·쿠키·로그인 없이 동작 확인)

### 1. 목록 — HTML 조각을 준다 (JSON 아님)

```
POST https://www.tplusmobile.com/BackBone/rate/rate_list
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: https://www.tplusmobile.com/main/rate/join

tp=F&key=&keyword=&seloptiontp=&selcompanytp=&recommendtp=&selplanstp=all_plans
&filter_data_s=0&filter_data_e=999999&filter_voice_s=0&filter_voice_e=999999
&filter_price_s=0&filter_price_e=999999&selsorttp=
&sel_companies=&sel_sms=&sel_network=&sel_qos=&sel_term=&sel_benefit_seqs=
```

- 응답은 **`ㅹㆄ`(U+FB79 U+3204) 로 나뉜 문자열**이다:
  `[0]TRUE · [1]HTML 조각 · [2]총건수 · [3]이번 건수 · [4]tp · [5]다음키 · [6]누적`
- 한 쪽에 **20개**. 다음 쪽은 `tp=N` + `key=<[5]다음키>`. 12쪽에 **총 235개**.
- 필터 값 (목록 페이지의 `data-filter-*` 속성이 근거):
  - `sel_companies` = `skt` / `kt` / `lgt` ⚠️ **LGU+는 `lgt`** (카드 배지 클래스는 `lgu`다 — 이름이 다르다)
  - `sel_network` = `LTE` / `5G` ← **세대를 이걸로 갈랐다** (LTE 209 + 5G 26 = 235, 딱 맞음)
  - `sel_qos` = `5` / `3` / `1`, `sel_sms` = `999999` / `300` / `100`, `sel_term` = `99` / `12` / `6` / `1`

### 2. 상세 — 서버 렌더 HTML (그냥 `curl` 하면 된다)

```
GET https://www.tplusmobile.com/main/rate/plan_details?seq=<seq>
```

- `seq`는 목록 카드의 `<input class="plan-seq" value="…">` — **128자리 hex**.
  같은 요금제를 재조회해도 **값이 그대로였다**(암호화지만 결정적) → sourceUrl에 써도 된다.
- 프리티와 달리 상세는 **서버가 다 그려서 준다.** playwright 없이 파싱 가능.

## 값이 어디에 있나

### 카드(목록)

| 뜻 | 자리 |
|---|---|
| 망 | `<i class="badge skt\|kt\|lgu">SKT\|KT\|LGU+</i>` |
| 할인 종류·자격 | `<i class="badge custom">` — `7개월 요금할인` `평생 요금할인` `24개월 요금할인` `5G 요금제` `복지요금제` `시니어 요금제(만65세 이상)` `외국인 전용 요금제` `스마트기기 전용` |
| 데이터 | `<p class="desc desc20px700">` — 「100GB 최대 5Mbps」 「11GB 일 2GB 최대 3Mbps」 「일 5GB 최대 5Mbps」 |
| 통화 / 문자 / 영상 | `<span class="ico call">` / `ico message` / `ico video` |
| 한 줄 설명 | `<span class="text">7개월간 월 11,900원, 7개월 후 월 48,400원</span>` |

### ⚠️ 상세의 `amountArea`로 값을 읽어라 — 카드만 보면 틀린다

```html
<div class="amountArea">
  <p class="desc desc16px700b50">  7개월 후 월 48,400원   </p>   <!-- 특가 끝난 뒤 값 -->
  <p class="desc throthDescMedium"> 월 52,800원           </p>   <!-- 정가 -->
  <p class="desc desc28px700">      월 11,900 원          </p>   <!-- 지금 내는 값 -->
```

- 카드의 `<p class="desc throthDesc">`는
  - **특가 요금제**에서는 「특가 끝난 뒤 값」(48,400)이고
  - **「평생 요금할인」 요금제**에서는 「**정가**」(59,400)다.
  자리 뜻이 뒤바뀐다 → 카드만 보면 평생할인 요금제의 월 요금을 2배 넘게 부풀린다.

### `.desc16px700b50` 라벨이 판정을 다 해 준다

| 라벨 원문 | 우리 스키마 | 몇 개 |
|---|---|---|
| `N개월 후 월 X원` / `N개월 후 평생 월 X원` | `monthlyFee = X`, `promo = { months: N, feeDuring: 지금값 }` | 185 |
| `평생 월 X원` | `monthlyFee = X`, `promo = null` (정가는 memo로) | 46 |
| `복지할인 대상자만 가입 가능` | **안 담는다** | 3 |
| `N개월 후 평생 X원, 만65세이상 가능` | **안 담는다** | 1 |

### 「통신유형」 항목 = 세대

```html
<span class="ico type">통신유형</span></p><p class="desc desc18px500b21"> LTE </p>
```

`sel_network` 필터 결과와 235개 전부 일치했다(LTE 209 / 5G 26).

## ⚠️ 아직 안 풀린 것

### 1. 부가세를 원문이 말하지 않는다

**사이트 어디에도 「부가세 포함」 문구가 없다** — 요금제 목록·상세·FAQ 다 뒤졌다.
정가가 1.1의 배수(52,800=48,000×1.1 · 39,600=36,000×1.1 · 22,000=20,000×1.1)라 부가세 포함 표시가로 보이지만
**지어내지 않았다.** 표시가를 그대로 담고 memo에 적었다. (프리티는 「부가세 포함」이라고 명시한다 — 대비된다.)

### 2. 세대가 원문 안에서 어긋나는 6개 (전부 SKT망)

`5G 통화안심 6GB / 10GB / 15GB / 20GB / 25GB / 30GB`

- 이름이 「5G」로 시작하고 카드 배지도 「5G 요금제」
- 그런데 상세 「통신유형」은 **LTE**, 목록 `sel_network=LTE` 필터에도 들어 있다

구조화된 항목 두 곳(통신유형 + 필터)이 LTE라 **LTE로 담고 memo에 충돌을 적었다.** 총괄 확인 필요.

## 안 담은 것 (2026-09-01 · 235개 중 40개)

| 왜 | 몇 개 | 근거 |
|---|---|---|
| 일 단위 데이터 (`11GB 일 2GB 최대 3Mbps` 23 · `일 5GB 최대 5Mbps` 8) | **31** | DECIDED 2026-09-01 「일 단위 데이터 요금제는 1차에서 안 담는다」 |
| 스마트기기 전용 | **3** | 배지 「스마트기기 전용」 (LTE 스마트데이터 10G·20G, 티플 태블릿데이터20G) |
| 복지 요금제 | **3** | 값 자리에 원문 그대로 「복지할인 대상자만 가입 가능」 |
| 외국인 전용 | **2** | 배지 「외국인 전용 요금제」 (티플 외국인 7GB＋3Mbps 2종) |
| 시니어(만65세 이상) | **1** | 배지 「시니어 요금제(만65세 이상)」 |

**선불(충전식)은 없었다** — 티플러스 요금제 목록은 전부 후불이다. **3G 전용도 없었다.**

## 뒤진 곳

- `/main/rate/join` HTML 안에 `getList()` 함수가 통째로 들어 있다 — 통로·파라미터를 여기서 찾았다.
- 다른 ajax: `/BackBone/rate/rate_benefit_list.do`, `/BackBone/rate/rate_custom_list.do`,
  `/BackBone/rate/rate_filter_count.do`, `/BackBone/rate/getComparisonList.do` (요금제 값은 `rate_list`에 다 있다)
- `/main/customer/faq` — 부가세 문구 찾으러 갔다. **없었다.**
- 화면 확인은 playwright headless로 상세 2개를 실제 렌더해 `amountArea`와 「통신유형」을 눈으로 대조했다
  (스냅샷 `sources/tplus-list-2026-09-01-plan-list.md` 안 「실제 화면에 찍힌 글자」).

## 다시 뜨는 법

```
node scripts/fetch-tplus-plans.mjs <출력폴더>
```

원본만 내려받는다. `src/data/plans/tplus.json`은 사람이 위 규칙으로 판정해 만든다.
