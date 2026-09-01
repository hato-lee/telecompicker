// 에스원 안심모바일 요금제 수집 — 2026-09-01
//
// 통로: POST http://www.s1mobile.co.kr/home/plan/getPlanRateList.do (#srhForm 직렬화)
// 자세한 길은 data/carriers/s1/README.md
//
// 사용법: node scripts/fetch-s1-plans.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const CHECKED_AT = '2026-09-01'
const LIST = 'http://www.s1mobile.co.kr/home/plan/getPlanRateList.do'
const VIEW = 'http://www.s1mobile.co.kr/home/plan/rateView.do'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const NET = { SKT: 'SKT', KT: 'KT', LGUP: 'LGU+' }
const NET_SUFFIX = { SKT: 'skt', KT: 'kt', LGUP: 'lgu' }
const MNOS = ['SKT', 'KT', 'LGUP']
const RATE_CODES = ['', '01', '02', '03', '04'] // 그룹 탭 (getRateGroup.do)

async function fetchList(mno, rateCode) {
  const body = new URLSearchParams({
    mno,
    rateDv: 'U', // U = 유심요금(온라인 신규 가입 가능). P(휴대폰요금)는 mall 목록이 전부 0건이었다.
    chargePlanSn: '1',
    orderBy: '1',
    rateCode,
    searchMallSp: 'mall',
    titleText: '',
    staffOrdYn: '',
  })
  const res = await fetch(LIST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: 'http://www.s1mobile.co.kr/home/plan/rateList.do?rateDv=U',
      'User-Agent': UA,
    },
    body,
  })
  const json = await res.json()
  return json[0]?.list ?? []
}

const won = (s) => Number(String(s ?? '').replace(/[^0-9]/g, '') || 0)
const vat = (n) => Math.round(Number(n) * 1.1)

function dataGB(s) {
  const m = String(s || '').match(/^([\d.]+)(GB|MB)\+?$/)
  if (!m) return null
  return m[2] === 'MB' ? Number(m[1]) / 1024 : Number(m[1])
}

function throttleMbps(s) {
  const m = String(s || '').match(/([\d.]+)\s*(Mbps|Kbps)/i)
  if (!m) return null
  return /kbps/i.test(m[2]) ? Number(m[1]) / 1000 : Number(m[1])
}

function voiceMinutes(s) {
  if (s === '기본제공') return null
  const m = String(s || '').match(/^(\d+)분$/)
  return m ? Number(m[1]) : undefined
}

function smsIncluded(s) {
  if (s === '기본제공') return true
  const m = String(s || '').match(/^(\d+)건$/)
  return m ? Number(m[1]) > 0 : undefined
}

const main = async () => {
  const seen = new Map()
  for (const mno of MNOS) {
    for (const rateCode of RATE_CODES) {
      for (const p of await fetchList(mno, rateCode)) {
        if (p.openYn === 'N') continue
        seen.set(`${p.mno}|${p.chargePlanSn}`, p)
      }
    }
  }
  const all = [...seen.values()]

  const skipped = { device: [], daily: [], restricted: [], unparsable: [] }
  const rows = []

  for (const p of all) {
    // catCode: P0301 일반 / P0302 주니어 / P0303 시니어 / P0304 청소년 (rateList.do 스크립트)
    if (p.catCode && p.catCode !== 'P0301') {
      skipped.restricted.push(p.chargePlanNm)
      continue
    }
    // 통화·문자가 없는 것 = 디바이스/데이터쉐어링/데이터전용 → 휴대폰 요금제가 아니다
    if (p.dmstcTalkServing === '-' || p.smsServing === '-' || /디바이스|쉐어링/.test(p.chargePlanNm)) {
      skipped.device.push(p.chargePlanNm)
      continue
    }
    // 일 단위 데이터는 1차에서 담지 않는다 — DECIDED.md
    if (/매일|일\s*\/\s*\d/.test(p.dataServeAddInfo || '')) {
      skipped.daily.push(p.chargePlanNm)
      continue
    }

    const voice = voiceMinutes(p.dmstcTalkServing)
    const sms = smsIncluded(p.smsServing)
    const gb = dataGB(p.dataServing)
    if (voice === undefined || sms === undefined || gb === null) {
      skipped.unparsable.push(`${p.chargePlanNm} (통화 "${p.dmstcTalkServing}" / 문자 "${p.smsServing}" / 데이터 "${p.dataServing}")`)
      continue
    }

    const listPrice = vat(p.bassChrge) // 원문 상세의 「월정액 : N원(vat 포함)」과 같은 값
    const saleNow = listPrice - vat(p.chrgeDscnt) - vat(p.promoSalePrice)

    // 원문이 「N개월 후 X원」이라고 말하는 것만 promo로 담는다.
    const after = String(p.addDispMsg || '').match(/(\d+)\s*개월\s*후\s*([\d,]+)\s*원/)
    let monthlyFee
    let promo = null
    const memoBits = []

    if (after) {
      const months = Number(after[1])
      monthlyFee = won(after[2])
      const cutDuringPromo = won(p.addDispMsg3)
      const feeDuring = monthlyFee - cutDuringPromo
      promo = { months, feeDuring, note: p.addDispMsg }
      memoBits.push(`원문 카드 문구: 「${p.addDispMsg}」 (정가 ${listPrice.toLocaleString()}원)`)
    } else {
      // 「프로모션 적용가」는 보이지만 몇 개월인지 원문이 말하지 않는다 → 정가로 담는다 (DECIDED.md)
      monthlyFee = listPrice
      if (saleNow !== listPrice) {
        memoBits.push(
          `프로모션 적용가 ${saleNow.toLocaleString()}원이 보이나 기간을 원문이 말하지 않는다. 상세 페이지는 「월정액 : ${listPrice.toLocaleString()}원(vat 포함)」이라고만 적는다`,
        )
      }
    }
    if (p.dataServeAddInfo && p.dataServeAddInfo !== '-') memoBits.push(`데이터 소진 후: ${p.dataServeAddInfo}`)
    if (p.vidoTalkServing && p.vidoTalkServing !== '-') memoBits.push(`영상/부가통화: ${p.vidoTalkServing}`)

    rows.push({
      id: `s1-${p.chargePlanSn.toLowerCase()}-${NET_SUFFIX[p.mno]}`,
      carrier: '에스원 안심모바일',
      carrierType: 'mvno',
      network: NET[p.mno],
      name: p.chargePlanNm.trim(),
      generation: p.avail === '5G' ? '5G' : 'LTE',
      monthlyFee,
      promo,
      dataGB: gb,
      throttleMbps: throttleMbps(p.dataServeAddInfo),
      voiceMinutes: voice,
      smsIncluded: sms,
      sourceUrl: `${VIEW}?rateDv=U&mno=${p.mno}&chargePlanSn=${p.chargePlanSn}&pageNo=1`,
      checkedAt: CHECKED_AT,
      memo: memoBits.join(' / ') || undefined,
    })
  }

  rows.sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync('src/data/plans/s1.json', JSON.stringify(rows, null, 1) + '\n')

  mkdirSync('data/carriers/s1/sources', { recursive: true })
  writeFileSync(`data/carriers/s1/sources/all-${CHECKED_AT}-getPlanRateList.json`, JSON.stringify(all, null, 1) + '\n')

  console.log(`에스원 안심모바일: 원문 ${all.length}개 → 담은 것 ${rows.length}개`)
  for (const [k, v] of Object.entries(skipped)) console.log(`  뺀 것 ${k}: ${v.length} ${v.join(', ')}`)
  const byNet = {}
  for (const r of rows) {
    const k = `${r.network}/${r.generation}`
    byNet[k] = (byNet[k] || 0) + 1
  }
  console.log('  망·세대별:', JSON.stringify(byNet))
}

main()
