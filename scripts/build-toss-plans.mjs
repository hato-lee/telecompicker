import fs from 'node:fs'
// 저장소 뿌리 (이 파일은 scripts/ 안에 있다)
const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const raw = JSON.parse(
  fs.readFileSync(`${ROOT}/data/carriers/toss/raw/toss-2026-09-01.json`, 'utf8'),
)

const NET = { SKT: 'SKT', KT: 'KT', LGU: 'LGU+' }
const SUF = { SKT: 'skt', KT: 'kt', LGU: 'lgu' }

function slug(name) {
  let s = name
    .replace(/평생 할인/g, 'lifetime')
    .replace(/캐시백/g, 'cashback')
    .replace(/라이트/g, 'lite')
    .replace(/페이스페이/g, 'facepay')
    .replace(/분/g, 'min')
    .replace(/\+/g, ' plus')
    .replace(/\//g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return s
}

const kept = []
const dropped = []
for (const p of raw) {
  const d = p.dataUsage
  if (d.type === 'DAILY_EXTRA') {
    dropped.push({ why: '일 단위 데이터(DECIDED)', p })
    continue
  }
  if (p.isWelfare) {
    dropped.push({ why: '복지(자격 제한)', p })
    continue
  }
  const dp = p.discountPolicyList[0] || null
  let monthlyFee = p.monthlyFee
  let promo = null
  let memoBits = []
  if (dp) {
    if (dp.numberOfMonths === null) {
      monthlyFee = p.monthlyFee - dp.amount
      memoBits.push(
        `원문 요금제 화면 「평생 · 월 ${monthlyFee.toLocaleString()}원 / ${p.monthlyFee.toLocaleString()}원」 — 기간 없는 평생 할인이라 할인가를 제값으로 담았다(정가 ${p.monthlyFee.toLocaleString()}원).`,
      )
    } else {
      promo = { months: dp.numberOfMonths, feeDuring: p.monthlyFee - dp.amount }
      memoBits.push(
        `원문 요금제 화면 「${dp.numberOfMonths}개월 동안 월 ${promo.feeDuring.toLocaleString()}원 / ${p.monthlyFee.toLocaleString()}원」.`,
      )
    }
    memoBits.push(
      `원문 상세 「할인 혜택은 9월 1일 오후 8시 0분까지 가입해야 받을 수 있어요」 — 이 할인은 가입 마감 시각이 붙어 있다(내부 통로 applyEndTs ${dp.applyEndTs}).`,
    )
  } else {
    memoBits.push('원문 요금제 화면에 할인 표시 없음 — 제값 그대로.')
  }

  const voiceTxt =
    p.callUsage.type === 'UNLIMITED'
      ? '통화 · 문자 무제한'
      : `통화 ${p.callUsage.amount}분 · 문자 100건`
  memoBits.push(
    `데이터·통화·문자는 원문 상세 「데이터 ${d.basicAmount}GB / 다 써도 ${d.speedLimit}Mbps 속도 / ${voiceTxt}」 그대로.`,
  )
  memoBits.push('부가세 포함 여부를 원문이 말하지 않는다 — 화면 표시가를 그대로 담았다.')

  kept.push({
    id: `toss-${slug(p.displayName)}-${SUF[p.mnoCarrier]}`,
    carrier: '토스모바일',
    carrierType: 'mvno',
    network: NET[p.mnoCarrier],
    name: p.displayName,
    generation: p.network === '5G' ? '5G' : 'LTE',
    monthlyFee,
    promo,
    dataGB: Number(d.basicAmount),
    throttleMbps: d.speedLimit ?? null,
    voiceMinutes: p.callUsage.type === 'UNLIMITED' ? null : p.callUsage.amount,
    smsIncluded: true,
    sourceUrl: `https://tossmobile.co.kr/pricing/${p.planCode}?carrier=${p.mnoCarrier}`,
    checkedAt: '2026-09-01',
    memo: memoBits.join(' '),
  })
}

kept.sort((a, b) => (a.id < b.id ? -1 : 1))
const ids = kept.map((k) => k.id)
if (new Set(ids).size !== ids.length) throw new Error('dup id: ' + ids.filter((x, i) => ids.indexOf(x) !== i))
fs.writeFileSync(
  `${ROOT}/src/data/plans/toss.json`,
  JSON.stringify(kept, null, 1) + '\n',
)
console.log('kept', kept.length, 'dropped', dropped.length)
for (const d of dropped) console.log('  DROP', d.why, d.p.planCode, d.p.mnoCarrier, d.p.displayName)
const byNet = {}
for (const k of kept) byNet[k.network + ' ' + k.generation] = (byNet[k.network + ' ' + k.generation] || 0) + 1
console.log(byNet)
