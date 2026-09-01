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

- 시니어(17·29·32)·청소년(18·31)·키즈(117)·복지(128·161) — 가입 대상 제한
- 스마트워치(132)·2nd 디바이스(20) — 휴대폰 요금제 아님
- 단말결합(27·30) — 기기 묶음. 3G 요금제는 담되 스키마 generation이 LTE·5G뿐이면 안 담고 memo.

## 뒤진 곳

- 목록 페이지 `/rate/rateList.do`는 첫 HTML이 거의 비어 있고(1.9KB) 아코디언 펼칠 때 위 ajax를 부른다.
- 로더: `/resources/js/portal/rate/rateList.js` (accordion click → rateContentAjax.do 확인).
- 상세 페이지 URL 형식은 아직 안 찾음 — 갈래가 찾아서 여기에 적을 것 (sourceUrl 배지에 필요).
