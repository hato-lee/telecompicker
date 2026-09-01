// 이야기모바일(큰사람커넥트) 요금제 수집 — 2026-09-01
//
// 통로: POST https://www.eyagi.co.kr/shop/plan/json_proc.php (mode=comm_list_view)
// 자세한 길은 data/carriers/eyagi/README.md
//
// 사용법: node scripts/fetch-eyagi-plans.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const CHECKED_AT = '2026-09-01'
const AJAX = 'https://www.eyagi.co.kr/shop/plan/json_proc.php'
const DETAIL = 'https://www.eyagi.co.kr/shop/plan/detail.php'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const NET = { skt: 'SKT', kt: 'KT', lgt: 'LGU+' }
const NET_SUFFIX = { skt: 'skt', kt: 'kt', lgt: 'lgu' }

// 빠른칩(해시태그) 번호 — list.php의 data-tag
const TAG_TABLET = '25' // 태블릿요금제
const TAG_WELFARE = '41' // 복지요금제

async function ajax(extra = {}) {
  const body = new URLSearchParams({
    page_seq: '2',
    mode: 'comm_list_view',
    keyword: '',
    search_mindata: '0GB',
    search_maxdata: '무제한',
    search_pchip: '',
    'search_select_chip[]': 'all',
    search_callgride: 'all',
    search_networkgride: 'all',
    search_carrierSelect: 'all',
    search_planSort: 'reco',
    ...extra,
  })
  const res = await fetch(AJAX, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: 'https://www.eyagi.co.kr/shop/plan/list.php',
      'User-Agent': UA,
    },
    body,
  })
  return res.json()
}

function toRows(data) {
  const keys = Object.keys(data)
  const n = data.comm_code.length
  return [...Array(n)].map((_, i) => Object.fromEntries(keys.map((k) => [k, data[k][i]])))
}

const won = (s) => (s === '' || s === null || s === undefined ? null : Number(String(s).replace(/,/g, '')))

function throttleMbps(qos) {
  if (!qos) return null
  const k = String(qos).match(/^(\d+(?:\.\d+)?)K$/i)
  if (k) return Number(k[1]) / 1000
  const n = Number(qos)
  return Number.isFinite(n) && n > 0 ? n : null
}

function voiceMinutes(s) {
  if (s === '기본제공') return null // 무제한
  const m = String(s || '').match(/^(\d+)분$/)
  return m ? Number(m[1]) : undefined // undefined = 우리 그릇에 담을 수 없는 표기
}

function smsIncluded(s) {
  if (s === '기본제공') return true
  const m = String(s || '').match(/^(\d+)건$/)
  return m ? Number(m[1]) > 0 : undefined
}

const main = async () => {
  const all = toRows((await ajax()).data)
  const tablet = new Set((await ajax({ 'tab_seq[]': TAG_TABLET })).data.comm_code)
  const welfare = new Set((await ajax({ 'tab_seq[]': TAG_WELFARE })).data.comm_code)

  const skipped = { prepaid: [], tablet: [], welfare: [], teen: [], daily: [], unparsable: [] }
  const rows = []

  for (const r of all) {
    if (r.pay_type === '1') {
      skipped.prepaid.push(r.comm_name)
      continue
    }
    if (tablet.has(r.comm_code)) {
      skipped.tablet.push(r.comm_name)
      continue
    }
    if (welfare.has(r.comm_code)) {
      skipped.welfare.push(r.comm_name)
      continue
    }
    if (/청소년|주니어|시니어|실버|키즈/.test(r.comm_name)) {
      skipped.teen.push(r.comm_name)
      continue
    }
    // 일 단위 데이터(「매일 2GB」)는 1차에서 담지 않는다 — DECIDED.md
    if (/매일|일\s*\d/.test(r.add_data || '')) {
      skipped.daily.push(r.comm_name)
      continue
    }

    const voice = voiceMinutes(r.call_str)
    const sms = smsIncluded(r.sms_str)
    const freeMB = won(r.free_data)
    if (voice === undefined || sms === undefined || freeMB === null) {
      skipped.unparsable.push(`${r.comm_name} (통화 "${r.call_str}" / 문자 "${r.sms_str}" / 데이터 "${r.free_data_str}")`)
      continue
    }

    // 값 규칙 (원문 필드)
    //  base_fee        = 정가
    //  selling_price   = 지금 내는 값
    //  restoration_fee = 할인 기간이 끝난 뒤 값 (원복 요금)
    //  terms           = 할인 개월 수, 99 = 평생
    const months = r.terms && r.terms !== '99' ? Number(r.terms) : null
    const selling = won(r.selling_price)
    const restoration = won(r.restoration_fee)
    const monthlyFee = months ? restoration : selling

    const memoBits = []
    if (r.terms === '99') memoBits.push('원문 「평생(life)」 할인 — 할인가를 제값으로 담았다')
    else if (months) memoBits.push(`원문 「${months}개월」 할인, 이후 ${restoration.toLocaleString()}원`)
    else memoBits.push('원문에 할인 기간 표기가 없다 — 표시가를 그대로 담았다')
    if (r.add_data) memoBits.push(`추가 데이터: ${r.add_data}`)
    if (r.additional_calls) memoBits.push(`부가통화: ${r.additional_calls}`)

    rows.push({
      id: `eyagi-${r.comm_code.toLowerCase()}-${NET_SUFFIX[r.mno_gubun]}`,
      carrier: '이야기모바일',
      carrierType: 'mvno',
      network: NET[r.mno_gubun],
      name: r.comm_name,
      generation: r.is_5g_yn === '5G' ? '5G' : 'LTE',
      monthlyFee,
      promo: months ? { months, feeDuring: selling } : null,
      dataGB: Math.round((freeMB / 1024) * 100) / 100,
      throttleMbps: throttleMbps(r.qos),
      voiceMinutes: voice,
      smsIncluded: sms,
      sourceUrl: `${DETAIL}?comm_code=${r.comm_code}&agent_code=${r.agent_code}`,
      checkedAt: CHECKED_AT,
      memo: memoBits.join(' / '),
    })
  }

  rows.sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync('src/data/plans/eyagi.json', JSON.stringify(rows, null, 1) + '\n')

  mkdirSync('data/carriers/eyagi/sources', { recursive: true })
  writeFileSync(`data/carriers/eyagi/sources/all-${CHECKED_AT}-comm_list_view.json`, JSON.stringify(all, null, 1) + '\n')

  console.log(`이야기모바일: 원문 ${all.length}개 → 담은 것 ${rows.length}개`)
  for (const [k, v] of Object.entries(skipped)) console.log(`  뺀 것 ${k}: ${v.length}`)
  if (skipped.unparsable.length) skipped.unparsable.forEach((s) => console.log('    ' + s))
  const byNet = {}
  for (const r of rows) {
    const k = `${r.network}/${r.generation}`
    byNet[k] = (byNet[k] || 0) + 1
  }
  console.log('  망·세대별:', JSON.stringify(byNet))
}

main()
