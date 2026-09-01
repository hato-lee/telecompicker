// kt스카이라이프 모바일 요금제 수집 — 2026-09-01
// 통로: https://www.skylife.co.kr/product/mobile/all (Next.js App Router)
//   화면 카드는 JS가 그리지만 첫 HTML의 self.__next_f.push([1,"…"]) 조각 안에 요금제가 통째로 있다.
//   조각을 JSON.parse 해서 이어 붙이고 → "<id>:<json>" 줄로 표를 만들고 → "$<id>" 참조를 풀면 완전한 객체가 된다.
// ⚠️ price.baseFee(정가)와 price.default[0].fee(표시가)가 둘 다 있다. 화면에 보이는 건 fee 하나뿐.
// ⚠️ 슬러그가 중복된다(같은 요금제가 큐레이션 구역마다 다시 실림) — slug로 dedupe 필수.
// 쓰는 법: node scripts/fetch-skylife-plans.mjs <출력폴더>
import { writeFileSync, mkdirSync } from 'node:fs'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'
const URL_ALL = 'https://www.skylife.co.kr/product/mobile/all'
const out = process.argv[2] || '.skylife'
mkdirSync(out, { recursive: true })

const html = await (await fetch(URL_ALL, { headers: { 'User-Agent': UA } })).text()
writeFileSync(`${out}/all.html`, html)

let buf = ''
for (const m of html.matchAll(/self\.__next_f\.push\(\[1,(".*?")\]\)<\/script>/gs)) {
  try {
    buf += JSON.parse(m[1])
  } catch {
    /* 조각 하나가 깨져도 나머지는 살린다 */
  }
}
writeFileSync(`${out}/flight.txt`, buf)

const rows = new Map()
for (const line of buf.split('\n')) {
  const m = /^([0-9a-f]+):(.*)$/.exec(line)
  if (!m) continue
  const v = m[2]
  if (v.startsWith('I[') || v.startsWith('T') || v.startsWith('"$')) continue
  try {
    rows.set(m[1], JSON.parse(v))
  } catch {
    /* 텍스트 조각은 건너뛴다 */
  }
}

const resolve = (o, d = 0) => {
  if (d > 10) return o
  if (typeof o === 'string' && o.startsWith('$') && rows.has(o.slice(1)))
    return resolve(rows.get(o.slice(1)), d + 1)
  if (Array.isArray(o)) return o.map((x) => resolve(x, d + 1))
  if (o && typeof o === 'object')
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, resolve(v, d + 1)]))
  return o
}

const uniq = new Map()
for (const v of rows.values())
  if (v && typeof v === 'object' && v.type === 'MOBILE_PLAN' && !uniq.has(v.slug))
    uniq.set(v.slug, resolve(v))
writeFileSync(`${out}/plans.json`, JSON.stringify([...uniq.values()], null, 1))

// 가입 대상 제한은 TAG 객체가 알려 준다 (주니어/시니어/복지 전용/스마트기기)
const id2slug = new Map(
  [...buf.matchAll(/^([0-9a-f]+):\{"type":"MOBILE_(?:PLAN|ADDITIONAL)","slug":"([^"]+)"/gm)].map(
    (m) => [m[1], m[2]],
  ),
)
const tags = {}
for (const m of buf.matchAll(
  /"type":"TAG","slug":"[^"]+","name":"([^"]+)","shortDescription":"([^"]*)"[\s\S]{0,400}?"product":\[([^\]]*)\]/g,
)) {
  const sl = [...m[3].matchAll(/"\$([0-9a-f]+)"/g)].map((x) => id2slug.get(x[1])).filter(Boolean)
  if (sl.length) tags[m[1]] = [...new Set([...(tags[m[1]] ?? []), ...sl])].sort()
}
writeFileSync(`${out}/tags.json`, JSON.stringify(tags, null, 1))

console.log(`요금제 ${uniq.size}개, 태그 ${Object.keys(tags).length}종 → ${out}`)
