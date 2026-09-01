// KT닷컴(product.kt.com) 모바일 요금제 원문을 떠서 스냅샷용 덤프를 만든다.
//
// 사용법:
//   node scripts/fetch-kt-plans.mjs                 # 요약(목록 + 요금안내 표)을 stdout에
//   node scripts/fetch-kt-plans.mjs <저장경로.json> # JSON으로 저장
//   node scripts/fetch-kt-plans.mjs --items 1681,1693  # 특정 ItemCode만
//
// 길(2026-09-01 뚫음):
//  ① 목록: GET https://product.kt.com/wDic/getOptionItemListAjax.ajax
//        ?cate_code=6002&pageNo=1&listSize=100&filter_code=<탭>&option_code=
//     → 자바스크립트 없이 그냥 curl로 HTML 조각이 온다(목록 페이지 자체는 JS 렌더).
//     탭(filter_code): 186 통합요금제 · 187 온라인전용(요고) · 188 키즈/외국인
//                      189 태블릿/스마트워치 · 190 기타 · 191 전체
//     개수만 볼 땐 GET .../getOptionItemTotalCountAjax.ajax?filter_code=<탭>&option_code=
//     목록의 한 줄은 "요금제 묶음"이다(예: 「베이직」). 실제 요금제는 묶음 안에 여러 개.
//  ② 묶음 상세: https://product.kt.com/wDic/productDetail.do?ItemCode=<코드>&CateCode=6002
//     - 묶음 안의 요금제 이름·월정액은 이 HTML 안 selectGroupItem(...) 호출에 그대로 있다.
//     - 「요금안내」 표(월정액·데이터·음성·문자)는 JS로 그려진다. 두 갈래:
//       (a) /static/prodetail/<ItemCode>/web/htmlUploadType_*.html 안에서 불러오는
//           /static/prodetail/<ItemCode>/web/js/data/w_*_data*.js 의 DATA.base.tableHTML
//       (b) 그 파일이 없으면(요고 등) 렌더 후 DOM에서 긁어야 한다 → playwright
//     그래서 이 스크립트는 playwright로 렌더해서 표를 통째로 긁는다(둘 다 커버).
//
// ⚠️ 값의 최종 근거는 이 표다. 목록 화면의 「월 N원~」은 묶음 최저가라 그대로 쓰면 안 된다.
// ⚠️ 「선택약정 할인 시」·「7% 다이렉트 요금할인 시」는 정가가 아니다 — monthlyFee엔 월정액을 쓴다.

import { chromium } from 'playwright'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const LIST = 'https://product.kt.com/wDic/getOptionItemListAjax.ajax'
const DETAIL = 'https://product.kt.com/wDic/productDetail.do'
export const FILTERS = {
  186: '통합요금제',
  187: '온라인전용(요고)',
  188: '키즈/외국인',
  189: '태블릿/스마트워치',
  190: '기타',
  191: '전체',
}

const args = process.argv.slice(2)
const itemsArg = args.includes('--items') ? args[args.indexOf('--items') + 1] : null
const out = args.find((a) => a.endsWith('.json'))

/** 목록 탭 하나를 긁어 묶음(요금제 그룹) 배열을 낸다. */
export async function fetchGroups(filterCode) {
  const url = `${LIST}?cate_code=6002&pageNo=1&listSize=100&filter_code=${filterCode}&option_code=`
  const html = await (
    await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://product.kt.com/wDic/index.do?CateCode=6002' } })
  ).text()
  return html
    .split('<table class="plan-list">')
    .slice(1)
    .map((row) => ({
      itemCode: (row.match(/ItemCode=(\d+)/) ?? [])[1],
      groupName: (row.match(/<strong>\s*([^<]+?)\s*<\/strong>/) ?? [])[1],
      listedFrom: (row.match(/월\s*<strong>([\d,]+)<\/strong>/) ?? [])[1] ?? null,
      summary: ((row.match(/<td class="plan-info">([\s\S]*?)<\/td>/) ?? [])[1] ?? '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      detailUrl: `${DETAIL}?ItemCode=${(row.match(/ItemCode=(\d+)/) ?? [])[1]}&CateCode=6002`,
    }))
    .filter((g) => g.itemCode)
}

/** 묶음 상세를 렌더해서 ① 안에 든 요금제 목록 ② 「요금안내」 표를 낸다. */
export async function fetchDetail(page, itemCode) {
  const url = `${DETAIL}?ItemCode=${itemCode}&CateCode=6002`
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)

  // ① 묶음 안 요금제(이름 + 월정액) — 서버가 준 원본 HTML의 selectGroupItem() 인자에서 뽑는다
  //    (렌더 후 DOM에는 남지 않는 경우가 있어 fetch로 따로 받는다)
  const raw = await (await fetch(url, { headers: { 'User-Agent': UA } })).text()
  const subItems = [...raw.matchAll(/selectGroupItem\(([^)]*)\)/g)]
    .map((m) => [...m[1].matchAll(/'([^']*)'/g)].map((q) => q[1].trim()))
    .map((p) => ({ name: p[5], fee: p[7] }))
    .filter((x) => x.name)
  const seen = new Set()
  const plans = subItems.filter((x) => !seen.has(x.name) && seen.add(x.name))

  // ② 「요금안내」 표 — 렌더 후 DOM에서 그대로
  const tables = await page.evaluate(() =>
    [...document.querySelectorAll('table')]
      .map((t) =>
        [...t.querySelectorAll('tr')]
          .map((tr) =>
            [...tr.querySelectorAll('th,td')].map((c) => c.innerText.replace(/\s+/g, ' ').trim()).join(' | '),
          )
          .join('\n'),
      )
      .filter((s) => /월정액|원$|원 \|/.test(s)),
  )

  const title = await page.evaluate(() => document.title)
  return { itemCode, url, title, plans, tables }
}

const groups = itemsArg
  ? itemsArg.split(',').map((c) => ({ itemCode: c.trim() }))
  : (await fetchGroups(191)).filter(Boolean)

const browser = await chromium.launch({ headless: true })
const page = await (await browser.newContext({ locale: 'ko-KR', userAgent: UA })).newPage()
const details = []
for (const g of groups) {
  try {
    details.push({ ...g, ...(await fetchDetail(page, g.itemCode)) })
    process.stderr.write(`. ${g.itemCode} ${g.groupName ?? ''}\n`)
  } catch (e) {
    details.push({ ...g, error: String(e) })
    process.stderr.write(`! ${g.itemCode} ${e}\n`)
  }
}
await browser.close()

const result = { fetchedAt: new Date().toISOString(), source: 'product.kt.com CateCode=6002', details }
if (out) {
  const { writeFileSync, mkdirSync } = await import('node:fs')
  const { dirname } = await import('node:path')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, JSON.stringify(result, null, 1))
  console.log(`저장: ${out} (묶음 ${details.length}개)`)
} else {
  for (const d of details) {
    console.log(`\n########## ${d.itemCode} ${d.groupName ?? d.title ?? ''}\n${d.url ?? ''}`)
    for (const p of d.plans ?? []) console.log(`  - ${p.name} : 월 ${p.fee}원`)
    for (const t of d.tables ?? []) console.log(`\n[표]\n${t}`)
  }
}
