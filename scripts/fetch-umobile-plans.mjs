// U+유모바일(미디어로그) 요금제 수집 — 2026-09-01
// 통로: https://www.uplusumobile.com/product/pric/usim/pricList  (유심/eSIM, 서버 렌더 HTML)
//       https://www.uplusumobile.com/product/pric/phone/pricList (휴대폰)
//       상세 https://www.uplusumobile.com/product/pric/pricDetail?devKdCd=<ctgrId>&seq=<seq>
// 목록 카드가 data-* 속성으로 값을 다 들고 있다 (bscChrgAddVat=정가, discntAddVat=할인가, ofrDataVal=GB,
//   ppnGen 4=LTE 5=5G, offerVoice, qosOfrVol=속도제어 kbps)
// 쓰는 법: node scripts/fetch-umobile-plans.mjs <출력폴더>
import { writeFileSync, mkdirSync } from 'node:fs'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'
const out = process.argv[2] || '.umobile'
mkdirSync(out, { recursive: true })
const get = async (u) => {
  const r = await fetch(u, { headers: { 'User-Agent': UA } })
  if (!r.ok) throw new Error(`${r.status} ${u}`)
  return await r.text()
}

const seqs = []
for (const tab of ['usim', 'phone']) {
  const html = await get(`https://www.uplusumobile.com/product/pric/${tab}/pricList`)
  writeFileSync(`${out}/list-${tab}.html`, html)
  for (const m of html.matchAll(/ctgrId="(\d+)"\s+seq="(\d+)"/g))
    seqs.push({ tab, ctgrId: m[1], seq: m[2] })
}
console.log('목록', seqs.length)

for (const s of seqs) {
  try {
    const html = await get(
      `https://www.uplusumobile.com/product/pric/pricDetail?devKdCd=${s.ctgrId}&seq=${s.seq}`,
    )
    writeFileSync(`${out}/detail-${s.tab}-${s.ctgrId}-${s.seq}.html`, html)
  } catch (e) {
    console.error('실패', s.seq, String(e))
  }
  await new Promise((r) => setTimeout(r, 200))
}
console.log('상세 저장 끝 →', out)
