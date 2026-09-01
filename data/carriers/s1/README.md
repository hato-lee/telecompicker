# 에스원 안심모바일 — 길 지도

수집 갈래가 2026-09-01 뚫음. 세콤(에스원)이 하는 독립 알뜰폰, 3망(SKT·KT·LGU+).
공식 사이트: **http://www.s1mobile.co.kr** (푸터에 「(주)에스원 사업자등록번호 208-81-13302 대표이사 정해린」,
Family Site가 `www.s1.co.kr` — 공식으로 확인했다. 검색으로 찾았고 https는 8447 포트로만 열려 있어 **http**를 쓴다.)

## 통로 (내부 ajax — 세션·쿠키 없이 동작 확인)

목록 화면: `http://www.s1mobile.co.kr/home/plan/rateList.do?rateDv=U` (유심요금)

1. **그룹 탭**: `POST /home/plan/getRateGroup.do` — body `telecom=skt&dataType=USIM`
   → `01`=데이터/통화 마음껏, `02`=데이터 마음껏, `03`=데이터/통화 필요한 만큼, `04`=실속 요금제
2. **요금제 목록**: `POST /home/plan/getPlanRateList.do` — `#srhForm`을 직렬화한 것
   ```
   mno=SKT|KT|LGUP   rateDv=U   chargePlanSn=1   orderBy=1
   rateCode=<01~04 또는 빈 값>   searchMallSp=mall   titleText=   staffOrdYn=
   ```
   응답은 `[{TCount, list, cpGrpList, sktCount, ktCount, lgupCount}]` — **배열의 0번**을 본다.

⚠️ **`TCount`와 `list.length`가 다르다.** 예: LGU+ `TCount=44`인데 `list`는 12건.
`TCount`는 「사내 요금제 전부」이고 `list`는 **온라인으로 지금 가입 가능한 것**만이다(우리가 원하는 쪽).
`rateCode=03`은 `TCount=17`인데 `list`가 **0건**이다 — 빈 응답이 곧 「없다」는 뜻이지 실패가 아니다.
`searchMallSp=mall`을 빼도 결과는 거의 같다(KT에서 「안심 데이터쉐어링」 1건만 더 나온다).

⚠️ **`rateDv=P`(휴대폰요금)는 12개 조합 전부 `list`가 0건**이다. 이번 수집은 `rateDv=U`만 썼다.

세 망 × 그룹 5가지(빈 값 포함)를 다 부른 뒤 `mno|chargePlanSn`으로 겹치는 것을 지우면 **33건**이 나온다.

## 값 필드 — ⚠️ 함정

- **`bassChrge`는 부가세 뺀 값이다.** 화면은 `bassChrge × 1.1`을 「기본료」로 찍는다
  (rateList.do 안 렌더 코드: `commaStr(parseInt(fltList[i].bassChrge *1.1))`).
  상세 페이지도 「기본정보 − **월정액 : 39,600원(vat 포함)**」이라고 적는다 (bassChrge 36,000).
- 판매가 = `bassChrge×1.1 − chrgeDscnt×1.1 − promoSalePrice×1.1`.
- **기간은 `addDispMsg` 네 형제가 말해 준다.**
  - `addDispMsg` = `"7개월 후 23,100원"` ← 할인이 끝난 뒤 낼 값
  - `addDispMsg4` = `"7개월"`
  - `addDispMsg2` = 계속 가는 할인(−14,300원), `addDispMsg3` = **특가 기간에만** 붙는 할인(−14,100원)
  - → `monthlyFee` = addDispMsg의 금액, `feeDuring` = 그 금액 − |addDispMsg3|.
    실측 검산: 37,400 − 14,300 = 23,100 ✓, 23,100 − 14,100 = 9,000 ✓(= 37,400 − 25,817×1.1).
  - ⚠️ **KT망 15건은 `addDispMsg`가 전부 `"-"`다.** `promoSalePrice`는 큰데 기간을 아무 데서도 말하지 않는다.
    상세 페이지도 「월정액 : 39,600원(vat 포함)」이라고만 하고 화면 라벨은 「프로모션 적용가」다.
    → DECIDED대로 **정가로 담고 할인가는 memo에만** 적었다. (`- 15,400원`처럼 마이너스 뒤 공백이 들어간 값도 있으니 숫자만 뽑아라.)
- 데이터 `dataServing` = `"7GB+"`·`"100GB+"`·`"2GB"`. **`+`는 속도제어가 붙는다는 뜻**이고,
  실제 속도는 `dataServeAddInfo`(`"소진시 최대 1Mbps속도로 계속 사용"`)에 있다.
- `dataServeAddInfo`에 `"일/2GB+…"`·`"매일2GB"`가 있으면 **일 단위 데이터**다(6건). 안 담았다.
- 통화 `dmstcTalkServing` = `기본제공`/`N분`/`-`. 문자 `smsServing` = `기본제공`/`N건`/`-`/`차단`.
  **둘 다 `-`면 휴대폰 요금제가 아니다**(디바이스·데이터쉐어링·데이터전용).
- 세대는 `avail`(`LTE`/`5G`)이다. `catCode`는 `P0301`(일반)·`P0302`(주니어)·`P0303`(시니어)·`P0304`(청소년) —
  나이 제한 판별에 쓴다. 이번 33건은 전부 `P0301`이었다.

## 상세(원문) 페이지 — 배지에 쓸 주소

`http://www.s1mobile.co.kr/home/plan/rateView.do?rateDv=U&mno=<SKT|KT|LGUP>&chargePlanSn=<코드>&pageNo=1`

## 담지 않은 것 (2026-09-01, DECIDED 기준)

| 무엇 | 개수 | 무엇이었나 |
|---|---|---|
| 디바이스·데이터전용 | 4 | 안심 디바이스 10K/20K, 이마트24 데이터만 10GB/20GB |
| 일 단위 데이터 | ~~6~~ **0** (2026-09-01 라운드 2에서 6건 전부 담음, `dailyDataGB` 신설) | 안심 USIM 데이터/통화마음껏K(밀리·다이소·올리브영), 〃U, U+ 매일 5GB+ ×2 |
| 나이 제한 | 0 | — |

33건 중 **23건**을 담았다. **라운드 2(2026-09-01)에서 일 단위 데이터 6건을 추가로 담아 29건.**
KT망 3건은 `addDispMsg`가 「-」라 DECIDED대로 정가로 담았다(모두 catCode=P0301, 나이 제한 없음).

## 뒤진 곳

- `/home/plan/rateList.do?rateDv=U` — 목록 화면. HTML에 요금제가 **없고** 위 ajax 두 개로 채운다.
  렌더 코드(가격 계산식·나이제한 표)가 전부 이 페이지 인라인 `<script>`에 있다.
- `/home/plan/rateList.do?rateDv=P`(휴대폰요금) — 위에 적은 대로 0건.
- `/mall/usim/getPolicyRate.do`, `/home/plan/getRateMoblList.do` — 안 뒤졌다(유심 정책가·가입 가능 단말).
