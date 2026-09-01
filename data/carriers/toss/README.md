# 토스모바일 — 길 지도

2026-09-01에 뚫음. 토스(비바리퍼블리카) 계열 알뜰폰, 3망 전부 판다.

- 공식 도메인: **https://tossmobile.co.kr** — 근거: 페이지 하단 사업자정보 「토스모바일(주) / 사업자번호 106-86-67749 /
  통신판매신고 제2017-서울금천-0164호 / 고객센터 1660-1114」, 로고·정적자원이 `static.toss.im`,
  API 호스트가 `api-public.toss.im`. 토스 공식 블로그(toss.im/tossfeed) 글에서도 이 주소를 안내한다.
- 요금제 목록: https://tossmobile.co.kr/pricing (탭: SKT 망 / KT 망 / LG U+ 망)
- 요금제 상세: `https://tossmobile.co.kr/pricing/<planCode>?carrier=<SKT|KT|LGU>`
  예) https://tossmobile.co.kr/pricing/LGU_100GB_LIFETIME?carrier=LGU

## 통로 (내부 API — 세션·쿠키·특별한 헤더 없이 200)

**`GET https://api-public.toss.im/api/v3/mvno-growth/products/homepage`**
→ `{ resultType: "SUCCESS", success: [ …47개… ] }` 한 방에 전부.

### 어떻게 찾았나 (다음 사람을 위해)

1. `/pricing` 을 curl 하면 Next.js 껍데기만 온다. `__NEXT_DATA__` 는 있지만
   **`props.pageProps` 가 `{}`** — 값이 서버에서 안 실린다. HTML 안에 "GB" 글자가 0번 나온다.
2. HTML의 `<script src>` 중 **`chunks/pages/pricing-*.js`** 를 받아서 문자열을 뒤진다.
   - `"/api/v3/mvno-growth/products/homepage"` 와 `"/api-web/v3/…"` 두 경로가 박혀 있다.
   - 같은 chunk 묶음에 호스트 `https://api-public.toss.im` 이 있다. 둘을 붙이면 위 통로다.
   - ⚠️ assetPrefix가 `https://tossmobile.co.kr/_next/tossmobile.co.kr/tossmobile.co.kr` 로
     **호스트 이름이 두 번 겹쳐 있다.** src 속성을 그대로 써야 chunk가 받아진다.
3. 화면과 대조: playwright로 `/pricing` 을 띄워 탭 3개를 눌러 눈으로 세었다.
   SKT 12 · KT 8 · LGU+ 27 = **47개, API 개수와 정확히 일치.**

## 값 필드 — ⚠️ 함정

| 필드 | 뜻 |
|---|---|
| `planCode` | 상세 URL에 그대로 들어간다 (`SKT_5G_250GB`, `LPZ7101279` 등) |
| `mnoCarrier` | `SKT` / `KT` / **`LGU`** (스키마의 `LGU+` 와 글자가 다르다) |
| `network` | **세대**다 (`5G` / `LTE`). 망이 아니다 — 망은 `mnoCarrier` |
| `monthlyFee` | **제값**(할인 안 붙은 값) |
| `discountPolicyList[0].amount` | 깎아 주는 액수. **할인가 = monthlyFee − amount** |
| `discountPolicyList[0].numberOfMonths` | 할인 달수. **`null` 이면 「평생」**(화면에도 「평생」이라 적힌다) |
| `discountPolicyList[0].applyEndTs` | 요금제 기간이 아니라 **가입 마감 시각**. 화면 문구 「할인 혜택은 9월 1일 오후 8시 0분까지 가입해야 받을 수 있어요」 |
| `dataUsage.type` | `NORMAL`(월 기본량) / **`DAILY_EXTRA`(기본 11GB + 매일 2GB, 월 최대 71GB)** |
| `dataUsage.speedLimit` / `speedLimitUnit` | 소진 후 속도. 관측된 단위는 전부 `Mbps` |
| `callUsage.type` | `UNLIMITED`(→ voiceMinutes null) / `LIMITED`(`amount` 분) |
| `promotionDiscountAmount` · `productPromotions` | 관측 전부 0·빈 배열 — **근거로 쓰지 않았다** |
| `isWelfare` | 관측 전부 false (복지 요금제는 이 목록에 없다) |

⚠️ **`DAILY_EXTRA` 요금제는 화면에 「71GB + 3Mbps」로만 적힌다.** 「일 2GB」라는 말이
소비자 화면 어디에도 없다 — 내부 통로에만 있다. (담고/안 담고는 아래 「담지 않은 것」)

## 담지 않은 것

- **`DAILY_EXTRA` 9개** (라이트 71GB ×3망, 캐시백 71GB ×2, 평생 할인 71GB, CU 71GB ×2, 페이스페이 71GB+)
  — DECIDED 「일 단위 데이터 요금제는 1차에서 안 담는다」. 총괄 재검토 대상으로 보고했다.
- 화면 아래 링크 「선불 요금제나 오프라인에서 가입할 수 있는 요금제」 — 이 목록 밖이라 값을 못 봤다.
- 복지 요금제 — 「장애인·국가유공자·수급자…만 가입할 수 있어요」라고 화면이 안내만 하고 목록에 없다.

## 뒤진 곳 (헛수고 기록)

- `__NEXT_DATA__` → pageProps 비어 있음.
- `_buildManifest.js` / `_ssgManifest.js` → 경로 목록뿐, 값 없음.
- `/faq` 를 playwright로 띄워 「부가세」를 찾았으나 본문이 안 실렸다(567자).
  **부가세 포함 여부는 아직 원문 근거가 없다.**
