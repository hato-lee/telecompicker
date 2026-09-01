// SK 세븐모바일(SK텔링크) 요금제 수집 — 2026-09-01
// 통로: https://www.sk7mobile.com/prod/data/callingPlanList.do?refCode=USIM|PHONE (정적 HTML)
//       상세 https://www.sk7mobile.com/prod/data/callingPlanView.do?refCode=<탭>&prodCd=<코드>
// 쓰는 법: node scripts/fetch-seven-plans.mjs <출력폴더>
import { writeFileSync, mkdirSync } from 'node:fs'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'
const BASE = 'https://www.sk7mobile.com/prod/data'
const out = process.argv[2] || '.seven'
mkdirSync(out, { recursive: true })

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return await r.text()
}

const found = []
for (const refCode of ['USIM', 'PHONE']) {
  const type = refCode === 'USIM' ? 'PROD_USIM_TYPE_ALL' : 'PROD_LTE_TYPE_ALL'
  const html = await get(
    `${BASE}/callingPlanList.do?refCode=${refCode}&searchCallPlanType=${type}&searchOrderby=6`,
  )
  writeFileSync(`${out}/list-${refCode}.html`, html)
  const codes = [...new Set([...html.matchAll(/fnSearchView\('(P[A-Z0-9]+)'/g)].map((m) => m[1]))]
  for (const c of codes) found.push({ refCode, prodCd: c })
}
console.log('목록', found.length)

for (const f of found) {
  const url = `${BASE}/callingPlanView.do?refCode=${f.refCode}&prodCd=${f.prodCd}`
  try {
    const html = await get(url)
    writeFileSync(`${out}/detail-${f.refCode}-${f.prodCd}.html`, html)
  } catch (e) {
    console.error('실패', f.prodCd, String(e))
  }
  await new Promise((r) => setTimeout(r, 250))
}
console.log('상세 저장 끝 →', out)
