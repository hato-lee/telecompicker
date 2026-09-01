# 키즈38 — 원문에서 본 값 (2026-09-01, 라운드 2 · 연령 전용)

- 요금제 id(우리): `kt-kids-38`
- KT 묶음(ItemCode): `1695` (키즈) — 목록 탭 `filter_code=188`(키즈/외국인)
- 상세/공시 페이지: https://product.kt.com/wDic/productDetail.do?ItemCode=1695&CateCode=6002
- 목록 ajax: https://product.kt.com/wDic/getOptionItemListAjax.ajax?cate_code=6002&pageNo=1&listSize=100&filter_code=188&option_code=
- 가입 및 유의사항 아코디언: https://product.kt.com/static/prodetail/1695/web/itemAccordion/html/accordion_20260622092457.html
- 확인 날짜: 2026-09-01

## ⭐ 가입 나이 — 원문 문구 그대로

> KT 키즈(만 12세 이하) 요금제 서비스를 소개합니다.

(상세 페이지 `<meta name="Description">` · schema.org Product description. **공시 「요금안내」 표 안에는 나이 문구가 없다.**)

> 본 요금제는 만 13세가 되는 생일 다음달 1일 아래의 일반요금제로 자동 전환되며, 자동 전환 전후에도 원하시는 경우 다른 요금제로 변경 가능합니다.

→ `ageMin: null` · `ageMax: 12`

## 원문 값 (렌더된 「요금안내」 표를 그대로 옮김)

| 칸 | 원문 그대로 |
|---|---|
| 요금제명 | 키즈38 |
| 월정액 | 38,000원 (원문 옆 `부가세 포함`) |
| 데이터 | 5GB+1Mbps |
| 공유데이터 | 기본데이터 내 이용 (단, 데이터쉐어링/데이터투게더 이용불가) |
| 음성/문자 (영상/부가) | 기본제공 (300분) |
| 선택약정 할인 시 | 원문에 있으나 **담지 않는다** |
| 7% 다이렉트 요금할인 시 | 원문에 있으나 **담지 않는다** |

## 우리 그릇에 담은 값

```json
{
  "id": "kt-kids-38",
  "carrier": "KT",
  "carrierType": "mno",
  "network": "KT",
  "name": "키즈38",
  "generation": "5G/LTE",
  "monthlyFee": 38000,
  "promo": null,
  "dataGB": 5,
  "dailyDataGB": null,
  "throttleMbps": 1,
  "voiceMinutes": null,
  "smsIncluded": true,
  "ageMin": null,
  "ageMax": 12,
  "sourceUrl": "https://product.kt.com/wDic/productDetail.do?ItemCode=1695&CateCode=6002",
  "checkedAt": "2026-09-01",
  "memo": "가입 나이 원문: 「KT 키즈(만 12세 이하) 요금제 서비스를 소개합니다.」(키즈 상세 페이지 meta/schema.org 설명 — 공시 표 안에는 나이 문구가 없다) · 가입 및 유의사항 원문: 「본 요금제는 만 13세가 되는 생일 다음달 1일 아래의 일반요금제로 자동 전환되며, 자동 전환 전후에도 원하시는 경우 다른 요금제로 변경 가능합니다.」 → ageMax 12. KT 현행 라인업은 「통합요금제」라 5G/LTE 구분 표기가 없다 — generation은 통합값 5G/LTE(라운드 1과 같은 기준). 월정액은 원문 「부가세 포함」. 「선택약정 할인 시」·「7% 다이렉트 요금할인 시」는 담지 않는다. 신규 가입·요금제 변경 시 법정대리인 동의 필요(원문). 주민등록번호 기준 1인당 1개 번호만 가입 가능. 추가혜택: KT 안심박스 무료제공."
}
```

## 담지 않은 값

- 선택약정 25% 할인가 · 7% 다이렉트 요금할인가 (DECIDED 2026-09-01: 공시 정가만).
- `promo`: null — 기간 한정 월정액 할인이 원문에 없다.
- 「KT 안심박스」·충전한도(0/16,500/27,500원) 등 부가 혜택은 담을 칸이 없다.
