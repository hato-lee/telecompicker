# 티플러스 — 일 단위 데이터 31개 + 시니어 1개 원문 스냅샷 (라운드 2, 2026-09-01)

- 목적: 게이트 2 결정(`docs/data-collection/DECIDED.md` 2026-09-01)으로
  ① `dailyDataGB` 그릇이 생겨 담게 된 「N GB 일 M GB」류 31개,
  ② 나이 질문이 생겨 담게 된 시니어 요금제(만65세 이상) 1개의 원본 증거.
- 통로: `POST https://www.tplusmobile.com/BackBone/rate/rate_list`(카드 목록, 「일」로 검색해 후보를 골랐다) +
  `GET https://www.tplusmobile.com/main/rate/plan_details?seq=<seq>`(상세, `amountArea` + 「통신유형」으로 값 확정) — README 통로 그대로.
- **덮어쓰지 않는다.**

## 시니어 1개 — 완전마음껏 시니어2G＋

원문 전문은 라운드 1이 이미 떠 둔 `data/carriers/tplus/sources/tplus-senior-2026-09-01-excluded.md`에 있다
(제목은 「-excluded」지만 내용은 그대로 유효 — 라운드 1 때는 나이 질문이 없어 안 담았을 뿐, 원문 자체는 안 바뀌었다).
이번 라운드가 다시 읽어 재확인함: 배지 「시니어 요금제(만65세 이상)」, 값 표시 「6개월 후 평생 8,800원, 만65세이상 가능」.

⇒ `ageMin=65`(배지 문구 「만65세 이상」 그대로 인용), `monthlyFee=8800`, `promo={months:6, feeDuring:5500}`,
`dataGB=2, dailyDataGB=null, throttleMbps=0.4`(400Kbps), `network=KT, generation=LTE`.

## 일 단위 31개 — 표본 하나 (티플북 11G＋, seq AB6AE9F5...)

상세 페이지에서 뽑은 글자:

```
SKT
7개월 요금할인
티플북 11G＋(도서문화상품권 매월 5000P)
11GB 일 2GB 최대 3Mbps
통화 기본제공
문자 기본제공
영상/부가통화 300 분
Wi-Fi 무료
통신유형 LTE
가입 후 90일 이내 에 음성 15분 이상 또는 데이터 100MB 이상 사용하셔야 할인혜택이 유지 됩니다.
7개월 후 월 48,400원        ← amountArea .desc16px700b50 (특가 끝난 뒤 값)
월 48,400원                  ← amountArea .throthDescMedium (정가 — 이 요금제는 특가형이라 위와 같음)
월 12,900 원                 ← amountArea .desc28px700 (지금 내는 값)
```

⇒ `monthlyFee=48400`, `promo={months:7, feeDuring:12900}`. `데이터 desc` 「11GB 일 2GB 최대 3Mbps」→
`dataGB=11, dailyDataGB=2, throttleMbps=3`. `통화=기본제공`→`voiceMinutes=null`(무제한). `통신유형=LTE`→`generation=LTE`.

## 전체 31개 목록 (카드 목록에서 데이터 표시에 「일」이 들어간 항목 — 235개 중)

| 이름 | 망 | 배지 | 데이터 표시 |
|---|---|---|---|
| 티플북 11G＋(도서문화상품권 매월 5000P) | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 올리브영 11GB＋(매월 5000P) | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 11G＋(웨이브) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 일5G＋(밀리의서재) | KT | 7개월 요금할인 | 일 5GB 최대 5Mbps |
| 완전마음껏 11GB＋＋(CU 20%할인＋올리브영 5,000원 상품권) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 완전마음껏 11GB＋＋(밀리의서재＋올리브영 5,000원 상품권) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| The 완전마음껏11G＋(다이소 매월 5000P) | LGU+ | 24개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| The 완전마음껏11G＋(컬쳐랜드상품권 매월 5000P) | LGU+ | 24개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| The 완전마음껏11G＋(스타벅스 매월 5000P) | LGU+ | 24개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| The 완전마음껏11G＋(올리브영 매월 5000P) | LGU+ | 24개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 완전마음껏11G＋_평생 | LGU+ | 평생 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 11G＋_24개월 할인 | LGU+ | 24개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 마음껏 매일5G＋_24개월 | LGU+ | 24개월 요금할인 | 일 5GB 최대 5Mbps |
| 티플온 11G＋ | LGU+ | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플온 일5G＋ | LGU+ | 7개월 요금할인 | 일 5GB 최대 5Mbps |
| 티플 11G＋(이디야커피) | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 CGV 11GB＋ | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 완전마음껏 11GB＋＋(네이버페이 매월 5000P) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 위드유 11GB＋(G car＋세차클링) | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 위드유 11GB＋(G car) | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| The 마음껏 매일5G＋(다이소 매월 5000P) | LGU+ | 24개월 요금할인 | 일 5GB 최대 5Mbps |
| The 마음껏 매일5G＋(컬쳐랜드상품권 매월 5000P) | LGU+ | 24개월 요금할인 | 일 5GB 최대 5Mbps |
| The 마음껏 매일5G＋(스타벅스 매월 5000P) | LGU+ | 24개월 요금할인 | 일 5GB 최대 5Mbps |
| The 마음껏 매일5G＋(카톡 이모티콘＋예스24e북) | LGU+ | 24개월 요금할인 | 일 5GB 최대 5Mbps |
| The 완전마음껏11G＋(카톡 이모티콘＋예스24e북) | LGU+ | 24개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| The 마음껏 매일5G＋(올리브영 매월 5000P) | LGU+ | 24개월 요금할인 | 일 5GB 최대 5Mbps |
| The 완전마음껏 11GB＋ | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 완전마음껏 11GB＋＋(배달의민족 매월 5000P) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 완전마음껏 11GB＋＋(멜론 매월 6900P) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 완전마음껏 11GB＋＋(왓챠 베이직 매월 무료) | KT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |
| 티플 11G＋(CU멤버십＋매월 5000P) | SKT | 7개월 요금할인 | 11GB 일 2GB 최대 3Mbps |

전부 상세 페이지 「통신유형」이 `LTE`. `통화=기본제공`(무제한) → `voiceMinutes=null`. `문자=기본제공` → `smsIncluded=true`.
「평생 요금할인」 1개(티플 완전마음껏11G＋_평생)만 `promo=null`(정가 35,200원은 memo에), 나머지 30개는
`amountArea`의 「N개월 후 월 X원」으로 `promo={months:N, feeDuring:지금값}`을 채웠다.

## 안 담은 것 재확인 (변동 없음)

이번 라운드는 「일 단위」·「시니어(만65세 이상)」만 대상. README에 이미 적힌 스마트기기 전용(3)·복지(3)·외국인 전용(2)은
이번에도 나이·데이터 그릇과 무관하므로 그대로 제외했다(추가 조건이 붙은 요금제 — DECIDED 「나이 외 추가 조건 붙은 것」).
