// 티플러스(한국케이블텔레콤) 요금제 수집 — 2026-09-01
//
// 통로 (자세한 것은 data/carriers/tplus/README.md):
//   목록: POST https://www.tplusmobile.com/BackBone/rate/rate_list  (HTML 조각을 준다)
//         응답은 'ㅹㆄ'로 나뉜다: [TRUE, HTML, 총건수, 이번건수, tp, 다음키, 누적]
//         다음 쪽은 tp=N + key=<다음키>.  sel_network=LTE|5G 로 세대별로도 부를 수 있다.
//   상세: GET https://www.tplusmobile.com/main/rate/plan_details?seq=<seq>  (서버 렌더 HTML)
//         seq는 목록 카드의 <input class="plan-seq" value="..."> — 같은 요금제면 값이 고정이다(재조회 확인).
//
// 실행:  node scripts/fetch-tplus-plans.mjs <출력폴더>
//   <출력폴더>/tp-cardsALL.html · tp-cardsLTE.html · tp-cards5G.html   목록 원본
//   <출력폴더>/tpdetail/<seq앞24자>.html                              상세 원본
// 이 스크립트는 원본만 내려받는다. src/data/plans/tplus.json은 사람이 판정해 만든다.

import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const SEP = 'ㅹㆄ'
const outDir = process.argv[2] || 'tmp-tplus'
fs.mkdirSync(path.join(outDir, 'tpdetail'), { recursive: true })

async function listPage(tp, key, net) {
  const body = new URLSearchParams({
    tp,
    key,
    keyword: '',
    seloptiontp: '',
    selcompanytp: '',
    recommendtp: '',
    selplanstp: 'all_plans',
    filter_data_s: '0',
    filter_data_e: '999999',
    filter_voice_s: '0',
    filter_voice_e: '999999',
    filter_price_s: '0',
    filter_price_e: '999999',
    selsorttp: '',
    sel_companies: '',
    sel_sms: '',
    sel_network: net || '',
    sel_qos: '',
    sel_term: '',
    sel_benefit_seqs: '',
  })
  const r = await fetch('https://www.tplusmobile.com/BackBone/rate/rate_list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: 'https://www.tplusmobile.com/main/rate/join',
      'User-Agent': UA,
    },
    body,
  })
  return (await r.text()).split(SEP)
}

async function fetchList(net) {
  let key = '',
    tp = 'F',
    html = ''
  for (let i = 0; i < 40; i++) {
    const p = await listPage(tp, key, net)
    if (p[0].trim() !== 'TRUE') throw new Error('목록 실패: ' + p[0].slice(0, 200))
    html += p[1]
    key = p[5]
    tp = 'N'
    const got = (html.match(/class="cardArea/g) || []).length
    console.error(`${net || 'ALL'} ${got}/${p[2]}`)
    if (!key || got >= Number(p[2])) break
    await new Promise((res) => setTimeout(res, 400))
  }
  fs.writeFileSync(path.join(outDir, `tp-cards${net || 'ALL'}.html`), html)
  return html
}

const all = await fetchList('')
await fetchList('LTE')
await fetchList('5G')

const seqs = [...all.matchAll(/class="plan-seq" value="([0-9A-F]+)"/g)].map((m) => m[1])
for (const seq of seqs) {
  const f = path.join(outDir, 'tpdetail', `${seq.slice(0, 24)}.html`)
  if (fs.existsSync(f)) continue
  const r = await fetch(`https://www.tplusmobile.com/main/rate/plan_details?seq=${seq}`, {
    headers: { 'User-Agent': UA, Referer: 'https://www.tplusmobile.com/main/rate/join' },
  })
  fs.writeFileSync(f, await r.text())
  await new Promise((res) => setTimeout(res, 180))
}
console.error(`목록 ${seqs.length}개 / 상세 ${fs.readdirSync(path.join(outDir, 'tpdetail')).length}개`)
