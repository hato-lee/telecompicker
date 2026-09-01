# 프리티 — 일 단위 데이터 요금제 35개 원문 스냅샷 (라운드 2, 2026-09-01)

- 목적: 게이트 2 결정(`docs/data-collection/DECIDED.md` 2026-09-01)로 `dailyDataGB` 그릇이 생겨 담게 된
  「월 N GB + 매일 M GB」류 35개의 원본 증거.
- 통로: `GET https://api.freet.co.kr/plan/v1/list?rowSize=20&pageNo=N&onlineAuth=Y` (목록) +
  `GET https://api.freet.co.kr/plan/v1/detail?svcCd=<svcCd>` (상세) — README의 통로 그대로.
- **덮어쓰지 않는다.**

## 표본 하나 — PC0SB00299 (목록/상세 원문 그대로, 필드만 추려서)

목록 응답:

```json
{
  "svcCd": "PC0SB00299",
  "svcName": "프리티 편의점금액권 11G+",
  "basicFee": "65890",
  "monthlyFee": "15950",
  "periodDiscMonth": 7,
  "periodDiscAmt": 49940,
  "foreverDiscAmt": 18810,
  "freeData": "월11GB+매일2GB",
  "freeVoice": "기본제공",
  "freeSms": "기본제공",
  "qos": "3Mbps",
  "genCd": "LTE",
  "svcType": "후불",
  "comType": "freeS"
}
```

상세 응답의 같은 필드 — 목록과 값이 같음을 확인함(위와 동일).

⇒ README의 변환식 적용: `periodDiscMonth=7 > 0` → `monthlyFee = basicFee - foreverDiscAmt = 65890 - 18810 = 47080`,
`promo = { months: 7, feeDuring: 15950(원문 monthlyFee) }`. `freeData` 「월11GB+매일2GB」→ `dataGB 11, dailyDataGB 2`.

## 전체 35개 목록 (`freeData`에 「매일」이 들어간 항목, 목록 API 원문 그대로)

195개 전체 중 「매일」이 들어간 항목은 **37개**였다. 그중 `svcType=선불`(BAND_PERF, FTDP79) **2개는 제외**
(README 기존 판정: 선불/충전식은 후불 월정액이 아니다 — 이번 라운드 대상 아님). 남은 **35개**를 담았다.

| svcCd | comType | svcType | freeData | basicFee | monthlyFee(원문) | periodDiscMonth | foreverDiscAmt |
|---|---|---|---|---|---|---|---|
| PC0SB00299 | freeS | 후불 | 월11GB+매일2GB | 65890 | 15950 | 7 | 18810 |
| FTDP311 | freeC | 후불 | 월11GB+매일2GB | 65890 | 20130 | 7 | 20900 |
| PC0SB00205 | freeS | 후불 | 월11GB+매일2GB | 49390 | 18700 | 7 | 0 |
| DATAPP | freeT | 후불 | 매일5GB | 56000 | 13100 | 7 | 3300 |
| PC0SB00275 | freeS | 후불 | 월11GB+매일2GB | 55000 | 25300 | 7 | 5500 |
| SB_5G5M | freeT | 후불 | 매일5GB | 62700 | 31900 | 7 | 5500 |
| SB_11G3M | freeT | 후불 | 월11GB+매일2GB | 55000 | 26400 | 7 | 5500 |
| FTDP295 | freeC | 후불 | 월11GB+매일2GB | 65890 | 20130 | 7 | 20900 |
| PC0SB00256 | freeS | 후불 | 월11GB+매일2GB | 65890 | 12870 | 7 | 16060 |
| PC0SB00213 | freeS | 후불 | 월11GB+매일2GB | 49390 | 18040 | 12 | 10450 |
| UDATA11G | freeT | 후불 | 월11GB+매일2GB | 49390 | 12980 | 7 | 6600 |
| KAIR_5G5M | freeT | 후불 | 매일5GB | 62700 | 38500 | 7 | 18700 |
| KAIR_11G3M | freeT | 후불 | 월11GB+매일2GB | 55000 | 33000 | 7 | 16500 |
| PC0SB00291 | freeS | 후불 | 월11GB+매일2GB | 55000 | 33000 | 7 | 16500 |
| PC0SB00240 | freeS | 후불 | 월11GB+매일2GB | 65890 | 19030 | 7 | 12100 |
| GIFT_11G | freeT | 후불 | 월11GB+매일2GB | 65890 | 27940 | 24 | 6600 |
| FTDP291 | freeC | 후불 | 월11GB+매일2GB | 65890 | 20130 | 7 | 20900 |
| EPA_M11G3M | freeT | 후불 | 월11GB+매일2GB | 38500 | 35200 | 0 | 3300 |
| TRIP_11G | freeT | 후불 | 월11GB+매일2GB | 65890 | 23980 | 12 | 23100 |
| PC0SB00295 | freeS | 후불 | 월11GB+매일2GB | 65890 | 22990 | 12 | 23100 |
| LPZ1007989 | freeT | 후불 | 매일5GB | 55000 | 29260 | 24 | 5500 |
| PC0SB00288 | freeS | 후불 | 월11GB+매일2GB | 65890 | 35090 | 24 | 15400 |
| FTDP287 | freeC | 후불 | 월10GB+매일2GB | 65890 | 21560 | 7 | 19580 |
| YES24_D5G | freeT | 후불 | 매일5GB | 59400 | 20130 | 7 | 3190 |
| YES24_11G | freeT | 후불 | 월11GB+매일2GB | 65890 | 19580 | 7 | 19580 |
| PC0SB00253 | freeS | 후불 | 월11GB+매일2GB | 65890 | 15290 | 7 | 22330 |
| PC0SB00249 | freeS | 후불 | 월11GB+매일2GB | 65890 | 18040 | 7 | 19580 |
| FTDP277 | freeC | 후불 | 월11GB+매일2GB | 65890 | 24090 | 7 | 12100 |
| FTDP265 | freeC | 후불 | 월11GB+매일2GB | 65890 | 18040 | 7 | 23100 |
| FTDP266 | freeC | 후불 | 월11GB+매일2GB | 65890 | 18040 | 7 | 23100 |
| FTDP234 | freeC | 후불 | 월11GB+매일2GB | 65890 | 18040 | 7 | 23100 |
| PC0SB00199 | freeS | 후불 | 월11GB+매일2GB | 49390 | 29590 | 24 | 9900 |
| E24_UNLMT | freeT | 후불 | 월11GB+매일2GB | 38500 | 34100 | 0 | 4400 |
| PC0SB00087 | freeS | 후불 | 월11GB+매일2GB | 49390 | 11990 | 7 | 6600 |
| DATA58 | freeT | 후불 | 월11GB+매일2GB | 64790 | 26290 | 24 | 25300 |

(제외 2개, 참고용): BAND_PERF(freeS, 선불), FTDP79(freeC, 선불) — 둘 다 `svcType=선불`(충전식)이라 안 담았다.

전부 `genCd=LTE`, `freeVoice=기본제공`(무제한), `freeSms=기본제공` — `voiceMinutes=null`, `smsIncluded=true`로 통일.
`qos`는 「월11GB+매일2GB」류가 3Mbps, 「매일5GB」류가 5Mbps.

## 판정 근거

- 값 변환식은 README 「요금 세 층을 화면이 만드는 식」 그대로: `periodDiscMonth>0` → `monthlyFee=basicFee-foreverDiscAmt`,
  `promo={months, feeDuring:원문monthlyFee}`. `periodDiscMonth==0 & foreverDiscAmt>0`(EPA_M11G3M, E24_UNLMT) →
  `monthlyFee=원문monthlyFee`, `promo=null`.
- `freeData` 문법: `월11GB+매일2GB` → `dataGB 11, dailyDataGB 2`. `매일5GB` → `dataGB 0, dailyDataGB 5`.
  `월10GB+매일2GB`(FTDP287) → `dataGB 10, dailyDataGB 2`.
