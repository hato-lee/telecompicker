# 스노우맨 (세종텔레콤) — 길 지도

수집 갈래가 2026-09-01 뚫음. 세종텔레콤의 알뜰폰 브랜드.
공식 사이트: **https://www.snowman.co.kr** (세종텔레콤 공식 소개 페이지
`https://www.sejongtelecom.net/pages/service/cell_mvno`가 이 주소를 가리킨다 — 공식으로 확인했다.)

⚠️ **망은 KT와 LGU+ 둘뿐이다.** 요금제 화면의 탭이 `ALL / KT / LGU+`뿐이고 SKT 탭이 없다.
(검색 결과 일부가 3망이라고 말하지만 **원문에는 SKT가 없다.**)

## 통로

1. **목록**: `GET https://www.snowman.co.kr/portal/chageAdtnsvc/ppdChage/list` (후불요금제)
   - ⚠️ 여기는 **서버가 HTML을 다 그려 준다.** ajax가 아니다. 요금·이름·망이 마크업에 그대로 있다.
   - 구조: `#tabsALL` 안에 `<dl class="accordion-list">`가 분류마다 하나.
     분류 이름은 `<strong class="title">`(완전 무제한 / 데이터 무제한 / 음성 무제한 / 5G 요금제 / 제휴요금제 / 복지요금제),
     그 아래 카드가 `onClick="popDtl('<코드>', '', '00', '')"`.
   - `#tabsKT`·`#tabsLG`는 같은 카드를 다시 그린 것이다 — **`#tabsALL`만 읽으면 39건 전부**다.
   - 분류 열어 두기: `?chageProdGroupDivCd=01` (페이지 스크립트의 `CHAGE_PROD_GROUP_CD`가 이 값을 받는다.)
     ⚠️ `?chageProdSeq=…`는 아무 효과가 없다.
2. **값(상세)**: `POST https://www.snowman.co.kr/portal/chageAdtnsvc/getChageDtl`
   - `Content-Type: application/json`, 본문 `{"chageProdSeq":"10501"}`
   - ⚠️ **경로 앞의 `/portal`을 빼면 404다.** (`portalCommon.js`의 `requestPost`가 붙여 준다.)

## 값 필드

| 필드 | 뜻 |
|---|---|
| `basChage` | 월 요금(**부가세 포함**, 23,100 = 21,000×1.1) |
| `basDataCpct` + `basDataUnit` | 기본 데이터. `basDataUnlmtYn='Y'`면 무제한 |
| `apdDataSpeedRstrtnUnit` | 소진 후 속도제어(`1Mbps`·`3Mbps`·`5Mbps`·`10Mbps`) |
| `basTlk` / `basTlkUnlmtYn` | 통화(분) / 무제한 여부 |
| `basChr` / `basChrUnlmtYn` | 문자(건) / 무제한 여부 |
| `commCmpnCd` | 망 — **`KT`와 `LG`** (`LG` = LGU+) |
| `commSpecCd` | 세대 — `LTE` / `5G` |
| `chageProdGroupDivCd` | 분류 코드(위 딥링크에 쓴다) |
| `simplDesc` | 한 줄 소개 — **여기에 일 단위 데이터가 숨어 있다** |

## ⚠️ 특가(할인) — 이 집은 단순하다

목록의 `popDtl(코드, promBnfit, engtMons, lowstChage)` 네 인자 중
**39건 전부가 `('', '00', '')`** — `engtMons='00'`은 화면 스크립트에서 **「무약정」**으로 찍힌다(`chageList.js`).
`lowstChage`(월 최저)가 비어 있으면 화면은 `basChage`를 그대로 「월 N원」으로 보여 준다.
→ **할인·특가 표기가 아예 없다.** 그래서 `monthlyFee = basChage`, `promo = null`.

## ⚠️ 일 단위 데이터가 이름에만 있는 게 아니다

`LTE데이터선택10G`는 이름에 「일」이 없는데 `simplDesc`가 **「기본제공량 소진시 일2GB 추가」**다.
이름 + `simplDesc` + `apdPrvQntGdnc`를 **다 봐야** 놓치지 않는다. (이 함정으로 한 번 잘못 담았다가 고쳤다.)

## 담지 않은 것 (2026-09-01, DECIDED 기준)

| 무엇 | 개수 | 무엇이었나 |
|---|---|---|
| 일 단위 데이터 | 7 | 스노우맨 일5GB+5Mbps, 통화기본 데이터매일5GB+, LTE데이터선택10G, 데이터11GB+일2GB++ ×4 |
| 복지 | 0 | 「복지요금제」 아코디언이 **비어 있다** |
| 나이 제한 | 0 | — |

39건 중 **32건**을 담았다.

## 뒤진 곳

- `/portal/usim/usimChageSbsc`(유심 요금제) — 가입 흐름 화면이고 요금 목록이 아니다.
- `/portal/main`, `/portal/mphon/mphonList`(휴대폰 구입) — 이번에 안 뒤졌다.
- `/portal/assets/web/js/chageAdtnsvc/chageAdtnsvc/chageList.js` — `popDtl` 정의(값 해석 규칙의 근거).
- `/portal/assets/web/js/comn/portalCommon.js` — `requestPost`(경로 앞 `/portal` 규칙).
- **요금제마다 따로 난 주소는 없다** — 상세는 모달이다. `sourceUrl`은 분류를 여는 목록 주소를 썼다.
