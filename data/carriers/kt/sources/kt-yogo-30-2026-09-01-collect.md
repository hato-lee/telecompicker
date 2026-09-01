# 요고 30 — 원문에서 본 값 (2026-09-01 확인)

- 원문: https://product.kt.com/wDic/productDetail.do?ItemCode=1567&CateCode=6002
- 묶음(상세 페이지): 「요고 모바일」 · KT닷컴 상품서비스 > 모바일 > 요금제 (CateCode=6002)
- 값의 출처: 「요금안내」 표 — 상세 페이지 렌더 후 DOM (+ 「데이터 제공」 아코디언 /static/prodetail/1567/web/itemAccordion/html/accordion_20260818175424.html)

## 원문 표에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | 요고 30 |
| 월정액 | 30,000원 (부가세 포함 — 원문 「부가세가 포함된 실제 지불금액입니다.」) |
| 데이터 | 8GB+다 쓰면 최대 400Kbps |
| 음성 | 기본제공 (+영상/부가 300분) |
| 문자 | 기본 제공 |

## 스키마에 담은 값

```
id            kt-yogo-30
carrier       KT / mno / network KT
generation    5G  ← ⚠️ 원문에 5G·LTE 구분 표기 없음. 스키마에 「통합」 값이 없어 5G로 담음
monthlyFee    30000
promo         null (요금제 자체에 붙은 기간 한정 할인 없음)
dataGB        8
throttleMbps  0.4
voiceMinutes  null (유무선 무제한)
smsIncluded   true
```

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- **선택약정(25%) 할인가** — 원문 목록/상세에 「선택약정 할인 시 N원」이 함께 적히지만 공시 정가가 아니다.
- **7% 다이렉트 요금할인가** — 다이렉트샵에서 단말 구매/유심 가입 시에만 붙는 조건부 할인이다.

## 메모

- 원문 각주: 「26.1.4 이전 요고30(5GB) 가입 고객님은 26.2.1자로 새로운 요고30(8GB) 요금제로 자동 변경 가입됩니다.」
