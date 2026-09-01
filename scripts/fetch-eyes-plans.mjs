// 아이즈모바일(아이즈비전) 전체 요금제 목록 긁기 — 2026-09-01
//
// 길: https://www.eyes.co.kr/payplan/all_plan/?&page=N  (서버가 HTML을 통째로 내려준다)
//   - 한 쪽에 20개, 마지막 쪽까지 돌면 끝(카드 0개인 쪽이 나오면 멈춘다)
//   - 카드마다 <a href="/payplan/plan_info/<id>/C01">
//   - ⭐ 할인 판정의 열쇠: <button class="tooltip_btn" data-discount='[{"label":"7개월 동안","price":10900},…]'>
//     label이 「N개월 동안」이면 기간 한정, 「평생」이면 그 값이 제값(또는 평생 할인가)이다.
//
// 쓰는 법: node scripts/fetch-eyes-plans.mjs > data/carriers/eyes/raw/eyes-2026-09-01.json
import { setTimeout as sleep } from 'node:timers/promises'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const dec = (s) =>
  s
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

function parseCards(html) {
  const out = []
  // 카드는 <a href="/payplan/plan_info/…" class="plan_card …"> 로 시작해 다음 카드/목록끝까지
  const parts = html.split(/<a href="\/payplan\/plan_info\//).slice(1)
  for (const raw of parts) {
    const id = raw.slice(0, raw.indexOf('/'))
    const card = raw.split('</a>')[0]

    const badges = [...card.matchAll(/<span class="badge ([^"]*)"[^>]*>([\s\S]*?)<\/span>/g)].map(
      (m) => ({ cls: m[1].trim(), text: dec(m[2]) }),
    )
    const name = dec((card.match(/<p class="body_medium sb">([\s\S]*?)<\/p>/) || [])[1] || '')
    const titBlock = (card.match(/<p class="h2 plan_tit">([\s\S]*?)<\/p>/) || [])[1] || ''
    const titSpans = [...titBlock.matchAll(/<span[^>]*>([\s\S]*?)<\/span>/g)].map((m) => dec(m[1]))
    const infoBlock = (card.match(/<div class="plan_info">([\s\S]*?)<\/div>/) || [])[1] || ''
    const infoLines = [...infoBlock.matchAll(/<p class="body_medium sb">([\s\S]*?)<\/p>/g)].map((m) =>
      dec(m[1]),
    )
    const orgP = dec((card.match(/<p class="body_small mb org_p">([\s\S]*?)<\/p>/) || [])[1] || '')
    const period = dec((card.match(/<p class="body_medium sb period">([\s\S]*?)<\/p>/) || [])[1] || '')
    const curP = dec((card.match(/<p class="primary_txt current_p b">([\s\S]*?)<\/p>/) || [])[1] || '')
    const dRaw = (card.match(/data-discount='([\s\S]*?)'/) || [])[1]
    let discount = null
    if (dRaw) {
      try {
        discount = JSON.parse(dRaw.replace(/&quot;/g, '"'))
      } catch {
        discount = dRaw
      }
    }
    const benefits = [...card.matchAll(/<p class="body_except mb">([\s\S]*?)<\/p>/g)].map((m) =>
      dec(m[1]),
    )

    out.push({
      id,
      url: `https://www.eyes.co.kr/payplan/plan_info/${id}/C01`,
      badges,
      name,
      dataText: titSpans,
      infoLines,
      orgP,
      period,
      curP,
      discount,
      benefits,
    })
  }
  return out
}

const all = []
for (let page = 1; page <= 40; page++) {
  const res = await fetch(`https://www.eyes.co.kr/payplan/all_plan/?&page=${page}`, {
    headers: { 'User-Agent': UA },
  })
  const html = await res.text()
  const cards = parseCards(html)
  if (cards.length === 0) break
  all.push(...cards)
  console.error(`page ${page}: ${cards.length}`)
  await sleep(400)
}
const seen = new Set()
const uniq = all.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)))
console.error(`total ${all.length}, unique ${uniq.length}`)
process.stdout.write(JSON.stringify(uniq, null, 1))
