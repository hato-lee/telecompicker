// 모빙(유니컴즈) 요금제 수집 — 2026-09-01
//
// 통로: https://www.mobing.co.kr/api/product/getV2PlanList (POST, JSON)
//       https://www.mobing.co.kr/api/product/getPlanInfo   (GET, planID+promoSeq)
// 자세한 길은 data/carriers/mobing/README.md
//
// 사용법: node scripts/fetch-mobing-plans.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const CHECKED_AT = '2026-09-01'
const LIST_URL = 'https://www.mobing.co.kr/api/product/getV2PlanList'
const INFO_URL = 'https://www.mobing.co.kr/api/product/getPlanInfo'
const PAGE_URL = 'https://www.mobing.co.kr/product/plan/view'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const NET = { SKT: 'SKT', KT: 'KT', LGT: 'LGU+' }
const NET_SUFFIX = { SKT: 'skt', KT: 'kt', LGT: 'lgu' }

// 담지 않는 것 (DECIDED.md 2026-09-01)
const RESTRICTED = /청소년|시니어|실버|복지|키즈|주니어|어린이|워치|태블릿|웨어러블/

async function getList() {
  const res = await fetch(LIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ page: 1, limit: 9999, telco: [] }),
  })
  const json = await res.json()
  return json.entity.list
}

async function getInfo(planID, promoSeq) {
  const q = new URLSearchParams({ planID })
  if (promoSeq) q.set('promoSeq', promoSeq)
  const res = await fetch(`${INFO_URL}?${q}`, { headers: { 'User-Agent': UA } })
  const json = await res.json()
  return json.entity
}

const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v))

function toGB(value, unit) {
  const n = num(value)
  if (n === null) return null
  return unit === 'MB' ? n / 1024 : n
}

function toMbps(value, unit) {
  const n = num(value)
  if (n === null || n === 0) return null
  return /kbps/i.test(unit || '') ? n / 1000 : n
}

function voiceMinutes(s) {
  if (!s) return 0
  if (s === '기본제공') return null // 무제한
  const m = s.match(/^(\d+)분$/)
  return m ? Number(m[1]) : 0
}

function smsIncluded(s) {
  if (!s) return false
  if (s === '기본제공') return true
  const m = s.match(/^(\d+)건$/)
  return m ? Number(m[1]) > 0 : false
}

const main = async () => {
  const list = await getList()
  const skipped = { daily: [], restricted: [], noData: [] }
  const kept = []

  for (const p of list) {
    if (RESTRICTED.test(p.planNm)) {
      skipped.restricted.push(p.planNm)
      continue
    }
    // 일 단위 데이터(「매일 N GB」)는 1차에서 담지 않는다 — DECIDED.md
    if (p.dayDataFlag === 'Y' || p.dailyQos || Number(p.basicDataDay) > 0) {
      skipped.daily.push(p.planNm)
      continue
    }
    kept.push(p)
  }

  const rows = []
  for (const p of kept) {
    const info = await getInfo(p.planID, p.promoSeq)
    const gen = info?.networkID === '5G' ? '5G' : 'LTE'

    const orig = Number(p.originAmountMon)
    const lt = Number(p.ltSaleAmount || 0)
    const during = Number(p.amountMon)
    const months = p.termShort ? Number(p.termShort) : null
    // termAll=1200개월(=100년) 짜리 할인은 모빙이 스스로 「평생 할인 요금제」라 부른다 → 제값에 반영
    const monthlyFee = orig - lt

    const memoBits = []
    if (lt > 0) memoBits.push(`평생 할인 ${lt.toLocaleString()}원 반영(원문 termAll=${p.termAll}개월)`)
    if (months) memoBits.push(`특가 ${months}개월(원문 termShort=${months})`)
    if (p.desc01) memoBits.push(`원문 문구: ${p.desc01}`)
    memoBits.push('원문: 프로모션 할인요금은 신규가입/번호이동 고객 대상')

    // 모빙 목록에는 「무제한 데이터」 표기가 없다 — 전부 기본량(+속도제어) 형태다.
    const dataGB = toGB(p.basicDataMon, p.basicDataMonUnit)

    rows.push({
      id: `mobing-${p.planID.toLowerCase()}-${NET_SUFFIX[p.telco]}`,
      carrier: '모빙',
      carrierType: 'mvno',
      network: NET[p.telco],
      name: p.planNm,
      generation: gen,
      monthlyFee,
      promo: months ? { months, feeDuring: during, note: p.desc01 || undefined } : null,
      dataGB,
      throttleMbps: p.qosFlag === 'Y' ? toMbps(p.basicQos, p.basicQosUnit) : null,
      voiceMinutes: voiceMinutes(p.basicVoice),
      smsIncluded: smsIncluded(p.basicSms),
      sourceUrl: `${PAGE_URL}?planID=${p.planID}&promoSeq=${p.promoSeq ?? ''}`,
      checkedAt: CHECKED_AT,
      memo: memoBits.join(' / '),
    })
  }

  rows.sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync('src/data/plans/mobing.json', JSON.stringify(rows, null, 1) + '\n')

  mkdirSync('data/carriers/mobing/sources', { recursive: true })
  writeFileSync(
    `data/carriers/mobing/sources/all-${CHECKED_AT}-getV2PlanList.json`,
    JSON.stringify(list, null, 1) + '\n',
  )

  console.log(`모빙: 원문 ${list.length}개 → 담은 것 ${rows.length}개`)
  console.log(`  일 단위 데이터로 뺀 것 ${skipped.daily.length}개`)
  console.log(`  가입 대상 제한으로 뺀 것 ${skipped.restricted.length}개`)
  const byNet = {}
  for (const r of rows) {
    const k = `${r.network}/${r.generation}`
    byNet[k] = (byNet[k] || 0) + 1
  }
  console.log('  망·세대별:', JSON.stringify(byNet))
}

main()
