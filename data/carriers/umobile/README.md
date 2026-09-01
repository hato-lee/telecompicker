# U+유모바일 (미디어로그) — 길 지도

수집 갈래가 2026-09-01 뚫음. LG U+ 자회사 알뜰폰. **공식: https://www.uplusumobile.com**
(도메인 확인 근거: 화면 로고 `U+유모바일`, 푸터의 공식 채널이 `instagram.com/umobile_official`·
`blog.naver.com/uplussave`, 「완전판매 가이드」 문구, 방송통신위원회 `msafer.or.kr` 링크.)

## 통로 (서버가 이미 다 그려서 보낸다 — JS 렌더 필요 없음)

1. **목록 — 유심/eSIM 136개** `GET /product/pric/usim/pricList`
2. **목록 — 휴대폰 42개** `GET /product/pric/phone/pricList`
3. **상세** `GET /product/pric/pricDetail?devKdCd=<ctgrId>&seq=<seq>`
   - `ctgrId`는 유심 `003`, 휴대폰 `001`. 목록 카드의 `ctgrId="003" seq="298"`에서 꺼낸다.
   - 원래는 `#searchFrm` POST 서브밋(`fnMoveDetail`)이지만 **GET 쿼리로도 그대로 먹는다.**
4. (참고) 카테고리 필터만 ajax다: `POST /product/pric/<usim|phone>/pricListAjax`.
   목록 카드 자체는 첫 HTML에 전부 들어 있어 **부를 필요가 없다.**

받아오는 스크립트: `scripts/fetch-umobile-plans.mjs <출력폴더>` (목록 2장 + 상세 178장)

## 값이 어디 있나 — 목록 카드가 값을 다 들고 있다

```html
<div class="box" data-ppnNm="LTE (7GB+/통화기본)" data-bscChrgAddVat="39800"
     data-discntAddVat="15900" data-ofrDataVal="7.0" data-p0PrPrcAddVat="23900"
     data-ppnGen="4" data-offerVoice="기본제공" data-qosOfrVol="1000">
  <a ctgrId="003" seq="298">
    <span class="pln-spc">(7+10)GB+1Mbps</span>      ← 데이터·속도제어의 진짜 근거
    <p class="pln-txt">통화 기본제공, 문자 기본제공</p>  ← 문자 포함 여부
    <span class="cost">월 39,800원</span>             ← 정가
    <strong class="dc">월 15,900원</strong>           ← 판매가
```

- `ppnGen` **4 = LTE, 5 = 5G**
- `p0PrPrcAddVat` = `bscChrgAddVat − discntAddVat` (할인 **금액**이지 나중 요금이 아니다)
- 화면의 두 값과 `bscChrgAddVat`·`discntAddVat`를 178개 전부 대조 → **불일치 0건**

## ⚠️ 함정

- ⭐ **`data-ofrDataVal`을 데이터 제공량으로 쓰면 안 된다.** 정렬용 대리값이라 이름과 어긋난다.
  실측: 「티머니 K-패스 (71GB+/통화기본)」의 `ofrDataVal`은 **999.0**, 「LTE 스페셜」은 **71.0**인데
  둘 다 `pln-spc`는 `11GB+일2GB+3Mbps`(기본 11GB)다. **`pln-spc` 문자열이 원문이다.**
- `pln-spc` 문법 네 가지: `15GB` · `7GB+1Mbps` · `(7+10)GB+1Mbps` · `11GB+일2GB+3Mbps` · `일5GB+5Mbps` · `미제공`
  - `(7+10)GB` = **기본 7GB + 기간한정 추가 10GB**(원문 「[기간 한정 프로모션] 24개월 동안 매월 데이터 10GB 추가 제공」).
    추가분은 기간이 한정이라 `dataGB`에 담지 않았다.
  - `일5GB+…`로 시작하면 **일 단위 요금제** → DECIDED에 따라 1차 제외.
- `<div class="box gift-show" …>`도 요금제 상자다. `class="box"` 정확 일치로 자르면 **3개를 놓친다**(133 vs 136).
- 상세의 「6개월 추가 할인 프로모션」 블록은 **HTML 주석 `<!-- -->`로 막혀 있다.**
  주석을 안 지우고 텍스트를 뽑으면 **없는 특가를 담게 된다.**
- `/support/faq/faqList` 같은 지원 주소는 **조용히 첫 화면으로 되돌린다**(200인데 내용이 홈).

## 특가 판정 — 「평생 할인」 (총괄 판정, 2026-09-01)

**`monthlyFee` = 화면 판매가(`strong.dc` = `data-discntAddVat`), `promo` = null.** 정가는 `memo`에.
156개 중 **134개**가 할인가로 담겼고, 22개는 원래 정가=판매가라 그대로다.

근거 세 가지:

1. 페이지 머리말이 스스로 「**평생 할인은 기본**, 나에게 딱 맞는 데이터와 혜택을 추천해드려요」라고 말한다.
2. 유의사항 「프로모션 요금 할인 내역은 개통하신 다음달 15일 이후부터 …확인하실 수 있습니다」 —
   할인이 청구에 계속 적용되는 구조고, **종료 시점 언급이 어디에도 없다.**
3. 기간이 있던 옛 특가(「6개월 추가 할인」)는 **주석으로 막아 내렸다** —
   **이 사이트는 기간이 있으면 기간을 적는다.**

실측: 상세 178장 전부를 훑었지만 **살아 있는 할인 기간(N개월) 문구는 한 장도 없다.**

⚠️ 다음 갈래에게 — **`monthlyFee`는 정가가 아니라 판매가다.** 정가와 헷갈리지 마라.
알뜰폰 판매가는 상시 바뀌니 재수집 때 `data-discntAddVat`를 다시 찍어야 한다.

기간이 적힌 유일한 예외: 「[더알뜰플랜]/[더알뜰플랜2]」 6개 —
「가입 익일부터 **24개월 약정**이 설정되며 약정 기간 내 해지 또는 요금제 변경 시 할인 반환금이 발생」.
약정이 끝난 뒤 요금은 안 적혀 있어 `promo`로 담지 못하고 `memo`에 문구만 남겼다.

부가세: 필드 이름 자체가 `…AddVat`이고 상세 유의사항에 「월 기본 요금 및 국내 통화료(데이터, 문자, 통화)는
**부가세 포함 금액**입니다.」 — VAT 포함 표시가다.

## 제외 기준 (원문 문구 그대로)

| 무엇 | 원문 |
|---|---|
| 틴에이저 3개 | 「만 18세 이하 개인 고객만 가입 가능한 틴에이저 전용 요금제」 |
| 시니어 3개 | 「만 65세 이상 개인 고객만 가입 가능한 시니어 전용 요금제」 |
| 이십세 6개 | 「본 요금제는 만 19세 이상부터 만 29세 이하만 가입이 가능합니다」 |
| 갤럭시틴즈 3 · [휴대폰] 청소년 1 | 「만 4세 이상, 만 18세 이하만 가입 가능 (1인 1회선 한정)」 |
| [휴대폰] 복지 1 | 「복지요금제 가입 대상자(개인)」 장애인·기초생활수급자·차상위계층 |
| 데이터만 10GB/20GB | 「LTE 전용 태블릿, 빔, 액션 캠 등 태블릿/스마트기기에서 이용 가능한 요금제입니다.」 |
| 일 단위 3개 | `pln-spc`가 `일5GB+5Mbps` |

**「YOUNG」 8개는 담았다** — 이름은 젊은이용 같지만 **상세 8장 어디에도 나이 제한 문구가 없다.**
원문이 말하지 않아 지어내지 않았다. 총괄 판정 대기.

## 뒤진 곳

- 목록 로더 `/app/js/pc/product/pric/usimPricList_2.js` — `fnMoveDetail`·`pricListAjax`를 여기서 찾았다.
- `/product/pric/usim/rcmdPricList`(추천 목록)는 요금제 상자가 0개다.
- 할인 기간을 적어 둔 곳: 상세 178장 · `/support/faq/faqList` · 첫 화면 — **못 찾았다.**
