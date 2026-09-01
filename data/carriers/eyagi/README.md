# 이야기모바일 (큰사람커넥트) — 길 지도

수집 갈래가 2026-09-01 뚫음. 독립 알뜰폰, 3망(SKT·KT·LGU+).
공식 사이트: **https://www.eyagi.co.kr** (루트가 `/shop/index.php`로 넘어간다.
푸터 사업자 표기와 `이야기모바일` 브랜드가 페이지 전체에 박혀 있어 공식 도메인으로 확인했다.)

## 통로 (내부 ajax — 세션·쿠키 없이 동작 확인)

**`POST https://www.eyagi.co.kr/shop/plan/json_proc.php`**
(Content-Type: `application/x-www-form-urlencoded; charset=UTF-8`, `X-Requested-With: XMLHttpRequest`,
Referer는 `https://www.eyagi.co.kr/shop/plan/list.php`로 넣어 두면 안전하다.)

| 무엇 | 보낼 것 |
|---|---|
| 목록 | `page_seq=2`, `mode=comm_list_view` |
| 개수만 | 위에 `submode=search_count` 추가 → `{"result":"SUCCESS","num":329}` |

⚠️ **빈 값을 그냥 보내면 12건만 온다.** 필터를 화면 기본값 그대로 채워야 329건 전부 온다:

```
search_mindata=0GB
search_maxdata=무제한        (#dataKnobA/#dataKnobB의 aria-valuetext)
search_select_chip[]=all
search_callgride=all
search_networkgride=all
search_carrierSelect=all
search_planSort=reco
```

응답은 **「필드별 배열」**이다(레코드 배열이 아니다). `data.comm_code[i]`, `data.comm_name[i]` … 를 i로 묶어 읽는다.

### 해시태그(빠른 칩)로 부분 목록 뽑기 — `tab_seq[]=<번호>`

`list.php`의 `data-tag` 값이 그대로 번호다.

| 번호 | 이름 | 번호 | 이름 |
|---|---|---|---|
| 31 | 이달의 특가 | 34 | 데이터 차단형 |
| 33 | 데이터빵빵 무제한 | 23 | 인터넷결합되는 요금제 |
| 38 | 초저가요금제 | **25** | **태블릿요금제** |
| 35 | 장기할인 요금제 | 8 | 부모님께 추천 |
| 4 | 빠른 5G | 36 | 청소년 추천 |
| 37 | 혜택많은 제휴요금제 | **41** | **복지요금제** |
| 24 | 매월 혜택받는 구독요금제 | 20·21·22 | LGU+ · SKT · KT |
| 26 | 케어서비스 | 60 | 쓰는만큼 내는 요금제 |
| **30** | **미리내는 선불요금제** | 62 | 통화시간 많은 요금제 |
| 10 | 세컨폰 쓰기좋은 | 63 | 이마트24 쿠폰주는 요금제 |

굵은 것이 「담지 않는 것」을 고르는 데 쓴 태그다.

## 값 필드 — ⚠️ 함정

- **요금이 4개다.** `base_fee`(정가) / `selling_price`(지금 내는 값) /
  `restoration_fee`(할인이 끝난 뒤 값) / `discount_rate`(%)
- **기간은 `terms`가 말해 준다.** `terms_str`가 `life`면 `terms=99`(= 평생),
  아니면 `t6`/`t12`/`t24`이고 `terms`에 **실제 개월 수**(4·6·7·12·18·24)가 들어 있다.
  → `life`면 `monthlyFee = selling_price`, `promo = null`
  → 개월 수가 있으면 `monthlyFee = restoration_fee`, `promo = {months, feeDuring: selling_price}`
  → `terms`가 빈 값이면 할인 자체가 없다(표시가 하나뿐).
  실측 확인: `life` 115건 모두 `selling_price === restoration_fee`, 개월제 185건 모두 `restoration_fee`가 채워져 있다.
- **부가세**: 상세 페이지가 직접 말한다 — 「이야기모바일의 모든 요금제 기본료는 **부가세가 포함된 금액**입니다.」
  상세 페이지에 「평생할인」이라는 말이 그대로 찍힌다(예: 기본요금 52,800원 → 50% 할인 → 월 26,400원 **평생할인**).
- `free_data`는 **MB 정수**다(11264 = 11GB). `free_data_str`는 사람이 읽는 문자열(`11GB`·`종량제`).
- `qos`는 숫자면 Mbps(`1`·`3`·`5`·`10`), `400K`·`200K`면 Kbps다.
- `add_data`에 `매일 2GB`·`매일 5GB`가 들어 있으면 **일 단위 데이터**다(38건). DECIDED에 따라 1차에서 안 담았다.
- `call_str` = `기본제공`(무제한) 또는 `N분`. `sms_str` = `기본제공` 또는 `N건`(`0건`이면 문자 없음).
- `additional_calls`는 **부가통화**(영상·정보이용)라 국내 음성과 다르다 — memo에만 남겼다.
- `is_5g_yn` = `5G` / `LTE`. `pay_type='1'`은 **선불**(24건, 태그 30과 정확히 같은 집합).
  `Band 데이터 …`(SKBAND*)도 선불이다 — 이름만 보면 후불처럼 보이니 조심.

## 상세(원문) 페이지 — 배지에 쓸 주소

`https://www.eyagi.co.kr/shop/plan/detail.php?comm_code=<comm_code>&agent_code=<agent_code>`
`agent_code`는 목록 응답에 함께 온다(`KSD0002`·`KSD0268`). 빼면 값이 안 뜬다.

## 담지 않은 것 (2026-09-01, DECIDED 기준)

| 무엇 | 개수 | 고른 방법 |
|---|---|---|
| 선불(미리내는) 요금제 | 24 | `pay_type === '1'` |
| 태블릿·디바이스 | 4 | 태그 25 |
| 복지 | 2 | 태그 41 |
| 청소년 | 2 | 이름에 「청소년」 |
| 일 단위 데이터 | 33 | `add_data`에 「매일」 |

329건 중 **264건**을 담았다.

## 뒤진 곳

- `/shop/plan/list.php` — 목록 화면. 첫 HTML에는 요금제가 **없고**(카드 8개는 헤더/추천용) `comm_list_view` ajax로 채운다.
- 로더는 페이지 안 인라인 `<script>`(`comm_list_view` / `search_count` 함수)에 그대로 들어 있다. 별도 js 파일 아님.
- 페이지 나누기 파라미터는 **없다** — 한 번에 전부 온다.
- `/shop/mplan/list.php`(휴대폰 요금제)와 `/shop/order/usimType.php`는 이번에 안 뒤졌다.
