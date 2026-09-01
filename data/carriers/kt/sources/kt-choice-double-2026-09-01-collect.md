# 초이스 더블 — 원문에서 본 값 (2026-09-01 확인)

- 원문: https://product.kt.com/wDic/productDetail.do?ItemCode=1692&CateCode=6002
- 묶음(상세 페이지): 「초이스 더블」 · KT닷컴 상품서비스 > 모바일 > 요금제 (CateCode=6002)
- 값의 출처: 「요금안내」 표 — /static/prodetail/1692/web/js/data/w_choice_double_data_20260812.js 의 DATA.base.tableHTML (상세 페이지가 렌더 시 삽입)

## 원문 표에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | 초이스 더블 |
| 월정액 | 120,000원 (부가세 포함 — 원문 「부가세가 포함된 실제 지불금액입니다.」) |
| 데이터 | 무제한 |
| 음성 | 기본제공 (영상/부가 300분) |
| 문자 | 기본제공 |

## 스키마에 담은 값

```
id            kt-choice-double
carrier       KT / mno / network KT
generation    5G  ← ⚠️ 원문은 「통합요금제」(5G/LTE 구분없이). 스키마에 「통합」 값이 없어 5G로 담음
monthlyFee    120000
promo         null (요금제 자체에 붙은 기간 한정 할인 없음)
dataGB        null (완전 무제한)
throttleMbps  null
voiceMinutes  null (유무선 무제한)
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- **선택약정(25%) 할인가** — 원문 목록/상세에 「선택약정 할인 시 N원」이 함께 적히지만 공시 정가가 아니다.
- **7% 다이렉트 요금할인가** — 다이렉트샵에서 단말 구매/유심 가입 시에만 붙는 조건부 할인이다.

## 메모

- 원문 「요금안내」 표는 혜택 조합별 5종(유튜브 프리미엄+넷플릭스 / 유튜브 프리미엄+Google AI Plus / 유튜브 프리미엄+디바이스 / 디바이스 / 디즈니플러스+폰케어)을 나열하지만 월정액·데이터·음성·문자가 모두 같아 한 줄로 담았다. 디즈니플러스 조합은 만 19세 이상만 가입 가능(원문 유의사항).
