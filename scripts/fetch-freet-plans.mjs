// 프리티(프리텔레콤) 요금제 수집 — 2026-09-01
//
// 통로 (자세한 것은 data/carriers/freet/README.md):
//   목록: GET https://api.freet.co.kr/plan/v1/list?rowSize=20&pageNo=N&onlineAuth=Y   (rowSize 20이 상한)
//   상세: GET https://api.freet.co.kr/plan/v1/detail?svcCd=<svcCd>
//   화면: https://www.freet.co.kr/plan/ratePlan/detail?svcCd=<svcCd>
//
// 실행:  node scripts/fetch-freet-plans.mjs <출력폴더>
//   <출력폴더>/ft-plans.json      목록 원본(합본)
//   <출력폴더>/ftdetail/<svcCd>.json  상세 원본
// 이 스크립트는 원본만 내려받는다. src/data/plans/freet.json은 사람이 판정해 만든다.

import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const HEAD = { 'User-Agent': UA, Referer: 'https://www.freet.co.kr/plan/ratePlan/list' }

const outDir = process.argv[2] || 'tmp-freet'
fs.mkdirSync(path.join(outDir, 'ftdetail'), { recursive: true })

const all = []
for (let pageNo = 1; pageNo <= 40; pageNo++) {
  const r = await fetch(
    `https://api.freet.co.kr/plan/v1/list?rowSize=20&pageNo=${pageNo}&onlineAuth=Y`,
    { headers: HEAD },
  )
  const j = await r.json()
  const rows = j.data.ratePlans
  all.push(...rows)
  console.error(`page ${pageNo}: ${rows.length} / ${j.data.totalCount}`)
  if (all.length >= j.data.totalCount || rows.length === 0) break
  await new Promise((res) => setTimeout(res, 250))
}
fs.writeFileSync(path.join(outDir, 'ft-plans.json'), JSON.stringify(all, null, 1))

for (const p of all) {
  const f = path.join(outDir, 'ftdetail', `${p.svcCd}.json`)
  if (fs.existsSync(f)) continue
  const r = await fetch(`https://api.freet.co.kr/plan/v1/detail?svcCd=${p.svcCd}`, { headers: HEAD })
  fs.writeFileSync(f, await r.text())
  await new Promise((res) => setTimeout(res, 180))
}
console.error(`목록 ${all.length}개 / 상세 ${fs.readdirSync(path.join(outDir, 'ftdetail')).length}개`)
