// 스노우맨(세종텔레콤) 요금제 수집 — 2026-09-01
//
// 통로: 목록은 서버가 그려 주는 HTML  https://www.snowman.co.kr/portal/chageAdtnsvc/ppdChage/list
//       값은  POST https://www.snowman.co.kr/portal/chageAdtnsvc/getChageDtl  {chageProdSeq}
// 자세한 길은 data/carriers/snowman/README.md
//
// 사용법: node scripts/fetch-snowman-plans.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const CHECKED_AT = '2026-09-01'
const LIST_PAGE = 'https://www.snowman.co.kr/portal/chageAdtnsvc/ppdChage/list'
const DETAIL_API = 'https://www.snowman.co.kr/portal/chageAdtnsvc/getChageDtl'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const NET = { KT: 'KT', LG: 'LGU+', LGU: 'LGU+', SKT: 'SKT', SK: 'SKT' }
const NET_SUFFIX = { KT: 'kt', 'LGU+': 'lgu', SKT: 'skt' }

async function getListPage() {
  const res = await fetch(LIST_PAGE, { headers: { 'User-Agent': UA } })
  return res.text()
}

async function getDetail(seq) {
  const res = await fetch(DETAIL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: LIST_PAGE,
      'User-Agent': UA,
    },
    body: JSON.stringify({ chageProdSeq: String(seq) }),
  })
  return res.json()
}

// 목록 HTML의 아코디언(분류) → 그 안의 popDtl('<seq>', …) 를 짝지어 읽는다.
function parseGroups(html) {
  const tab = html.slice(html.indexOf('id="tabsALL"'), html.indexOf('id="tabsKT"'))
  const groups = []
  const re = /<strong class="title">([^<]*)<\/strong>([\s\S]*?)(?=<strong class="title">|$)/g
  let m
  while ((m = re.exec(tab))) {
    const title = m[1].trim()
    const seqs = [...m[2].matchAll(/popDtl\('(\d+)'/g)].map((x) => x[1])
    for (const seq of seqs) groups.push({ seq, group: title })
  }
  return groups
}

const main = async () => {
  const html = await getListPage()
  const found = parseGroups(html)
  const bySeq = new Map()
  for (const f of found) if (!bySeq.has(f.seq)) bySeq.set(f.seq, f.group)

  const raw = []
  for (const seq of bySeq.keys()) raw.push({ ...(await getDetail(seq)), _group: bySeq.get(seq) })

  const skipped = { welfare: [], restricted: [], daily: [], unusable: [] }
  const rows = []

  for (const d of raw) {
    if (/복지/.test(d._group) || /복지/.test(d.chageProdNm || '')) {
      skipped.welfare.push(d.chageProdNm)
      continue
    }
    if (/청소년|시니어|실버|키즈|주니어|워치|태블릿/.test(d.chageProdNm || '')) {
      skipped.restricted.push(d.chageProdNm)
      continue
    }
    // 일 단위 데이터는 1차에서 담지 않는다 — DECIDED.md
    if (/매일|일\s*\d/.test(`${d.chageProdNm || ''} ${d.simplDesc || ''} ${d.apdPrvQntGdnc || ''}`)) {
      skipped.daily.push(d.chageProdNm)
      continue
    }
    if (d.useYn === 'N') {
      skipped.unusable.push(d.chageProdNm)
      continue
    }

    const network = NET[d.commCmpnCd] ?? NET[d.commCmpnNm]
    if (!network) {
      skipped.unusable.push(`${d.chageProdNm} (망을 모르겠다: ${d.commCmpnCd})`)
      continue
    }

    const gb =
      d.basDataUnlmtYn === 'Y'
        ? null
        : d.basDataUnit === 'MB'
          ? Number(d.basDataCpct) / 1024
          : Number(d.basDataCpct)

    const qos = String(d.apdDataSpeedRstrtnUnit || '').match(/([\d.]+)\s*(Mbps|Kbps)/i)

    const memoBits = ['원문 목록은 「무약정」(engtMons=00)만 표시한다 — 기간 할인 표기가 없다']
    if (d.apdDataSpeedRstrtnUnit) memoBits.push(`소진 후 속도제어: 최대 ${d.apdDataSpeedRstrtnUnit}`)
    if (d.simplDesc) memoBits.push(`원문 문구: ${d.simplDesc}`)
    memoBits.push(`분류: ${d._group} / 요금제 코드 ${d.chageProdCd}`)

    rows.push({
      id: `snowman-${String(d.chageProdCd).toLowerCase()}-${NET_SUFFIX[network]}`,
      carrier: '스노우맨',
      carrierType: 'mvno',
      network,
      name: d.chageProdNm,
      generation: d.commSpecCd === '5G' ? '5G' : 'LTE',
      monthlyFee: Number(d.basChage),
      promo: null,
      dataGB: gb,
      throttleMbps: qos ? (/kbps/i.test(qos[2]) ? Number(qos[1]) / 1000 : Number(qos[1])) : null,
      voiceMinutes: d.basTlkUnlmtYn === 'Y' ? null : Number(d.basTlk ?? 0),
      smsIncluded: d.basChrUnlmtYn === 'Y' || Number(d.basChr ?? 0) > 0,
      // 요금제마다 따로 난 주소가 없다 — 목록 페이지의 분류(아코디언)를 여는 주소가 가장 가깝다.
      sourceUrl: `${LIST_PAGE}?chageProdGroupDivCd=${d.chageProdGroupDivCd}`,
      checkedAt: CHECKED_AT,
      memo: memoBits.join(' / '),
    })
  }

  rows.sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync('src/data/plans/snowman.json', JSON.stringify(rows, null, 1) + '\n')

  mkdirSync('data/carriers/snowman/sources', { recursive: true })
  writeFileSync(`data/carriers/snowman/sources/all-${CHECKED_AT}-getChageDtl.json`, JSON.stringify(raw, null, 1) + '\n')

  console.log(`스노우맨: 원문 ${raw.length}개 → 담은 것 ${rows.length}개`)
  for (const [k, v] of Object.entries(skipped)) console.log(`  뺀 것 ${k}: ${v.length} ${v.join(', ')}`)
  const byNet = {}
  for (const r of rows) {
    const k = `${r.network}/${r.generation}`
    byNet[k] = (byNet[k] || 0) + 1
  }
  console.log('  망·세대별:', JSON.stringify(byNet))
}

main()
