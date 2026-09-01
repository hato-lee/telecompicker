# kt엠모바일 (kt M모바일) — 길 지도

총괄이 2026-09-01 뚫음. KT 자회사 알뜰폰. 공식 다이렉트몰: https://www.ktmmobile.com

## 통로 (내부 ajax — 세션·쿠키 없이도 동작 확인)

1. **카테고리 나무**: `POST https://www.ktmmobile.com/rate/getCtgXmlAllListAjax.do`
   - body(form): `rateAdsvcDivCd=RATE&rand=<아무숫자>`
   - Content-Type: `application/x-www-form-urlencoded; charset=UTF-8`, `X-Requested-With: XMLHttpRequest`
   - 49개: depth1(유심/eSIM=1, 제휴=2, 휴대폰=3) → depth2(LTE=4, 5G=5, 제휴 혜택별…) → depth3(실 그룹 25개)
2. **요금제 목록(그룹별)**: `POST /rate/rateContentAjax.do` body `rateAdsvcCtgCd=<depth3 코드>`
   - 예: `14`(초알뜰) → 3개, `9`(모두다 맘껏), `21`(5G 모두다 맘껏), `138`(제휴 밀리의서재) → 10개
   - depth2 코드(4, 5)로 부르면 **빈 배열** — 반드시 depth3 코드로 부른다.

## 값 필드 — ⚠️ 함정

- `rateAdsvcCd`(PL… 코드), `rateAdsvcNm`(이름), `bnfitData`("7GB+최대1Mbps"), `bnfitVoice`, `bnfitSms`
- 요금 필드가 4개다: `mmBasAmtDesc`(정가), `mmBasAmtVatDesc`, `promotionAmtDesc`, `promotionAmtVatDesc`
  - 초알뜰 1GB 실측: mm=15,400 / promoVat=**2,900** — **실판매가가 promoVat에 있다.**
  - **이 할인이 「평생(무약정) 할인」인지 「N개월 특가」인지는 목록 JSON이 말하지 않는다.**
    상세 페이지(요금제 카드 클릭)의 원문 문구로만 판정한다. `usePrd`는 0으로만 관측됨 — 근거로 쓰지 않는다.
- 데이터 문자열 해석: "1GB"(기본량), "7GB+최대1Mbps"(기본+속도제어 계속), "기본제공"(무제한)

## 제외할 카테고리 (DECIDED 기준)

- 복지(128·161) — 가입 대상 제한
- 스마트워치(132)·2nd 디바이스(20) — 휴대폰 요금제 아님
- 단말결합(27·30) — 기기 묶음. 3G 요금제는 담되 스키마 generation이 LTE·5G뿐이면 안 담고 memo.
- ⭐ **33(5G 요금제, `upRateAdsvcCtgCd=8` 「5G 휴대폰 요금제」)도 전부 단말결합이다** —
  카테고리 이름엔 「단말결합」이 없지만, 상세 팝업(rateLayer.do) 원문에
  **「단말기 약정 구매 시 가입이 가능한 단말결합 전용 요금제」**라고 못박혀 있다(8개 전부 확인, 2026-09-01).
  이름만 보고 담으면 기기값 결합 요금제가 섞인다 — 상세 팝업 원문까지 반드시 확인할 것.
- ⭐ **29(LTE 시니어 전용)·31(3G 청소년 전용)·32(3G 시니어 전용)는 여전히 안 담는다** — 카테고리 나무에서
  `upRateAdsvcCtgCd`를 따라가면 29는 `6`(LTE 휴대폰 요금제=단말결합), 31·32는 `7`(depth2 목록에 이름이 없는
  3G 휴대폰 계열 — 3G는 스키마 generation에 없음)로 올라간다. **나이 때문이 아니라 단말결합/3G라서 빠진다.**
  17(시니어)·117(키즈 안심)·18(청소년 전용)만 `up=4`(LTE 요금제, 유심형) 밑이라 순수 나이 제한이다 — 아래 참고.

### ⭐⭑ 라운드 2(2026-09-01, 게이트 2) — 연령 전용·일 단위 그릇 신설로 되살린 것

- **연령 전용(17·117·18)**: 위 판정대로 `up=4`(유심형) 밑의 시니어(17)·키즈 안심(117)·청소년 전용(18) 8+4+2=14개를
  상세 팝업(rateLayer.do)에서 나이 문구를 인용해 `ageMin`/`ageMax`로 담았다.
  - 17 시니어: 「만 65세 이상 개인 고객만 가입 가능한 시니어 전용 요금제」→ ageMin=65. **단, `PL21CM685`(시니어
    모두다 맘껏 8GB+)만 상세 팝업 원문에 이 문구가 없다** — 형제 요금제(4GB+)엔 있는데 8GB+엔 없다(재확인해도
    동일, 2026-09-01). 나이 문구를 인용 못 해 **이 1개는 안 담았다** — ⚠️ 판정 재검토 후보(사이트 표기 누락일
    수도, 실제로 나이 제한이 없는 요금제일 수도 있다).
  - 117 키즈 안심: 「만 4세 ~ 만12세 개인 고객만 가입 가능한 키즈 전용 요금제」→ ageMin=4, ageMax=12. 4개 전부 담음.
  - 18 청소년: 「만 19세 미만/이하 개인 고객만 가입 가능한 청소년 전용 요금제」→ ageMax=19. 2개 전부 담음.
  - 나이 외 추가 조건(부모 명의·특정 기기 등)은 상세 팝업 어디에도 없음 — 14개 전부 확인.
- **일 단위 데이터**: `bnfitData`에 `일`이 들어간 요금제 8개(카테고리 9 「모두다 맘껏」에 전부 있음) — 「11GB+일2GB+최대3Mbps」
  류 7개는 `dataGB=11, dailyDataGB=2, throttleMbps=3`으로, 「일5GB+최대5Mbps」 1개는 `dataGB=0, dailyDataGB=5,
  throttleMbps=5`로 담았다. 프로모션 요금은 상세 팝업 기준(아래 총괄 판정과 동일 방식).

## 뒤진 곳

- 목록 페이지 `/rate/rateList.do`는 첫 HTML이 거의 비어 있고(1.9KB) 아코디언 펼칠 때 위 ajax를 부른다.
- 로더: `/resources/js/portal/rate/rateList.js` (accordion click → rateContentAjax.do 확인).
- ⭐ **상세 페이지(팝업) URL 형식을 찾았다** — 로더 JS 757행 근처 `getRateListPanel`/`showRateDetail` 함수에서 확인:
  `GET https://www.ktmmobile.com/rate/rateLayer.do?rateAdsvcCtgCd=<depth3코드>&rateAdsvcGdncSeq=<rateAdsvcGdncSeq>&rateAdsvcCd=<요금제코드 예: PL212H918>`
  — 세션·쿠키 없이 curl로 바로 200 HTML(모달 내용 조각)이 온다. `rateAdsvcGdncSeq`는 목록 ajax 응답의 같은 필드값을 그대로 쓴다.
- ⭐ **이 상세 페이지 원문 어디에도 프로모션 할인의 적용 개월수·「평생/무약정」 여부가 없다** — 120개 표본 전수 확인(2026-09-01).
  `개월` 문구는 있지만 전부 「LTE 데이터 추가제공 24개월」류 결합 부가서비스 얘기지 요금 자체의 할인기간이 아니다.
  `평생`·`무약정`은 고객 후기(리뷰) 텍스트에서만 튀어나오고 KT M모바일 공식 설명문에는 없다 — 근거로 쓰면 안 된다.
- ⭐⭐ **2026-09-01 총괄 판정(코디네이터 메시지로 전달, 워크트리엔 아직 DECIDED.md 반영 전)**:
  상세 팝업 유의사항 원문 「요금제의 월정액은 실제 개통 시점의 판매가로 적용되며, 당사 정책에 의해 상시 변동 될 수 있습니다.」에 근거해
  **`monthlyFee`는 상세 팝업의 「프로모션 요금 (VAT 포함)」 값을 쓴다** (정가 `mmBasAmtVatDesc`가 아니라).
  정가는 memo에 인용만 남긴다. `promo{months,...}`는 여전히 안 담는다 — 이건 기간제 할인이 아니라 상시 변동 판매가라 기간 그릇 자체가 안 맞는다.
  ⚠️ **목록 ajax(`rateContentAjax.do`)의 `promotionAmtVatDesc`와 상세 팝업(`rateLayer.do`)의 「프로모션 요금」이 서로 안 맞는 사례가 있다고 총괄이 보고**
  (2026-09-01 시점 내가 fetch한 120개 스냅샷에서는 전수 일치했지만, 시점에 따라 달라질 수 있으니
  **반드시 상세 팝업 값을 근거로 쓰고 목록 ajax 값은 참고만** 할 것).
