import fs from 'node:fs'
// 저장소 뿌리 (이 파일은 scripts/ 안에 있다)
const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const raw = JSON.parse(
  fs.readFileSync(
    `${ROOT}/data/carriers/eyes/raw/eyes-2026-09-01.json`,
    'utf8',
  ),
)

const NET = { SKT: 'SKT', KT: 'KT', 'LGU+': 'LGU+' }
const SUF = { SKT: 'skt', KT: 'kt', 'LGU+': 'lgu' }

// 한글 이름 → 영문 슬러그 조각 (긴 낱말부터 바꾼다)
const WORDS = [
  ['세이브머니유심', 'savemoney-usim'],
  ['글로벌로밍', 'globalroaming'],
  ['롯데시네마', 'lottecinema'],
  ['OK캐쉬백', 'okcashbag'],
  ['밀리의서재', 'millie'],
  ['데이터안심', 'data-ansim'],
  ['데이터없는', 'nodata'],
  ['아이즈특판', 'eyes-teukpan'],
  ['아이즈팡팡', 'eyes-pangpang'],
  ['아이즈포스트', 'eyes-post'],
  ['아이즈우정', 'eyes-woojung'],
  ['든든아이즈', 'deundeun-eyes'],
  ['아이즈팩', 'eyes-pack'],
  ['네이버페이', 'npay'],
  ['국제전화', 'intlcall'],
  ['올리브영', 'oliveyoung'],
  ['음성자유', 'voicefree'],
  ['스텐다드', 'standard'],
  ['기본제공', 'basic'],
  ['이디야', 'ediya'],
  ['다이소', 'daiso'],
  ['스페셜', 'special'],
  ['화이트', 'white'],
  ['딥블루', 'deepblue'],
  ['그란데', 'grande'],
  ['아이즈', 'eyes'],
  ['데이터', 'data'],
  ['울트라', 'ultra'],
  ['올영', 'olyoung'],
  ['롯시', 'lottecine'],
  ['밀리', 'millie'],
  ['블루', 'blue'],
  ['무한', 'muhan'],
  ['벤티', 'venti'],
  ['Npay', 'npay'],
  ['톨', 'tall'],
  ['분', 'min'],
]

function slug(name) {
  let s = name.replace(/^\[[SKL]\]/, '').trim()
  for (const [k, v] of WORDS) s = s.split(k).join('-' + v + '-')
  return s
    .toLowerCase()
    .replace(/\+/g, '-plus-')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/\./g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const won = (s) => {
  const m = String(s).replace(/,/g, '').match(/(\d+)/)
  return m ? Number(m[1]) : null
}

function parseData(spans) {
  let dataGB = null
  let throttleMbps = null
  for (const sp of spans) {
    let m = sp.match(/^([\d.]+)GB$/)
    if (m && dataGB === null) dataGB = Number(m[1])
    m = sp.match(/^([\d.]+)MB$/)
    // 계열 관례: kt-basic-600mb → 0.6, lgu-data-plan-300mb → 0.3 (1GB = 1000MB)
    if (m && dataGB === null) dataGB = Number(m[1]) / 1000
    m = sp.match(/^([\d.]+)Mbps$/)
    if (m) throttleMbps = Number(m[1])
    m = sp.match(/^([\d.]+)Kbps$/)
    if (m) throttleMbps = Number(m[1]) / 1000
  }
  return { dataGB, throttleMbps }
}

const kept = []
const dropped = []
for (const c of raw) {
  const netBadge = c.badges.find((b) => ['SKT', 'KT', 'LGU+'].includes(b.text))
  const dayUnit = c.dataText.some((d) => /\/일/.test(d)) || /매일|일\s*\d+GB/.test(c.name)
  const foreigner = /foreigner|외국인/i.test(c.name) || c.benefits.some((b) => /내국인 가입불가/.test(b))
  const welfare = c.badges.some((b) => /복지/.test(b.text)) || /복지/.test(c.name)
  const device = /태블릿|스마트기기|워치|패드/.test(c.name)
  if (dayUnit) { dropped.push(['일 단위 데이터(DECIDED)', c]); continue }
  if (foreigner) { dropped.push(['외국인 전용(가입 자격 제한)', c]); continue }
  if (welfare) { dropped.push(['복지 요금제(가입 자격 제한)', c]); continue }
  if (device) { dropped.push(['태블릿·스마트기기용(휴대폰 요금제 아님)', c]); continue }
  if (!netBadge) { dropped.push(['망 배지를 못 읽음', c]); continue }

  const { dataGB, throttleMbps } = parseData(c.dataText)
  if (dataGB === null) { dropped.push(['데이터 표기를 못 읽음', c]); continue }

  const vRaw = c.infoLines[0] || ''
  const sRaw = c.infoLines[1] || ''
  const voiceMinutes = /기본제공/.test(vRaw) ? null : won(vRaw)
  if (voiceMinutes === null && !/기본제공/.test(vRaw)) { dropped.push(['통화 표기를 못 읽음', c]); continue }
  const smsN = /기본제공/.test(sRaw) ? null : won(sRaw)
  const smsIncluded = smsN === null ? true : smsN > 0

  // 값: 「N개월 동안 → 평생」 / 「평생」만 / 할인 없음
  const d = c.discount
  let monthlyFee = null
  let promo = null
  const memo = []
  const nameNoPrefix = c.name.replace(/^\[[SKL]\]/, '')
  if (Array.isArray(d) && d.length === 2 && /개월 동안/.test(d[0].label) && d[1].label === '평생') {
    promo = { months: Number(d[0].label.match(/(\d+)/)[1]), feeDuring: d[0].price }
    monthlyFee = d[1].price
    memo.push(
      `원문 「요금할인 정보」 표 그대로: 「${d[0].label} ${d[0].price.toLocaleString()}원 / 평생 ${d[1].price.toLocaleString()}원」. 목록 카드에도 「첫 ${promo.months}개월간 월 ${d[0].price.toLocaleString()}원」과 정가 ${c.orgP}이 함께 적혀 있다.`,
    )
  } else if (Array.isArray(d) && d.length === 1 && d[0].label === '평생') {
    monthlyFee = d[0].price
    memo.push(
      `원문 「요금할인 정보」 표가 「평생 ${d[0].price.toLocaleString()}원」 한 줄뿐 — 기간이 없는 평생 할인이라 할인가를 제값으로 담았다. 원문 정가 표기는 ${c.orgP}. 목록 카드 배지도 「평생할인」.`,
    )
  } else if (!d && !c.orgP && c.curP) {
    monthlyFee = won(c.curP)
    memo.push('원문 카드에 할인 표시·정가 취소선이 없다 — 표시가를 그대로 담았다.')
  } else {
    dropped.push(['할인 표기를 판정 못 함', c])
    continue
  }
  if (monthlyFee === null) { dropped.push(['요금을 못 읽음', c]); continue }

  const is5G = /^5G[\s(]/.test(nameNoPrefix)
  const isLTEnamed = /\(LTE\)/i.test(nameNoPrefix)
  memo.push(
    is5G
      ? '세대: 원문 요금제 이름이 「5G」로 시작한다.'
      : isLTEnamed
        ? '세대: 원문 요금제 이름에 「(LTE)」가 붙어 있다.'
        : '⚠️ 세대: 아이즈모바일 사이트는 요금제 이름 밖 어디에서도 5G/LTE를 밝히지 않는다. 이름에 「5G」가 없어 LTE로 담았다 — 원문이 LTE라고 직접 말한 것은 아니다.',
  )
  memo.push(
    `데이터·통화·문자는 원문 카드 그대로: 「${c.dataText.join(' + ')} / 통화 ${vRaw} / 문자 ${sRaw}」.`,
  )
  memo.push(
    '원문 유의사항 「프로모션할인 혜택은 신규가입, 번호이동 고객에게 적용됩니다」 — 갈아타는 사람에게 적용되는 값이다. 부가세 포함 여부를 원문이 따로 말하지 않아 화면 표시가를 그대로 담았다.',
  )

  kept.push({
    id: `eyes-${slug(c.name)}-${SUF[netBadge.text]}`,
    carrier: '아이즈모바일',
    carrierType: 'mvno',
    network: NET[netBadge.text],
    name: c.name,
    generation: is5G ? '5G' : 'LTE',
    monthlyFee,
    promo,
    dataGB: Math.round(dataGB * 1000) / 1000,
    throttleMbps,
    voiceMinutes,
    smsIncluded,
    sourceUrl: c.url,
    checkedAt: '2026-09-01',
    memo: memo.join(' '),
    _siteId: c.id,
  })
}

// id 충돌은 사이트 요금제 번호를 붙여 푼다 (sourceUrl 과 1:1)
const count = {}
for (const k of kept) count[k.id] = (count[k.id] || 0) + 1
for (const k of kept) {
  if (count[k.id] > 1) k.id = `${k.id}-${k._siteId}`
  delete k._siteId
}
kept.sort((a, b) => (a.id < b.id ? -1 : 1))
const ids = kept.map((k) => k.id)
const dups = ids.filter((x, i) => ids.indexOf(x) !== i)
if (dups.length) throw new Error('dup id: ' + [...new Set(dups)].join(', '))
for (const k of kept) if (!/^[a-z0-9-]+$/.test(k.id)) throw new Error('bad id: ' + k.id)

fs.writeFileSync(
  `${ROOT}/src/data/plans/eyes.json`,
  JSON.stringify(kept, null, 1) + '\n',
)
console.log('kept', kept.length, 'dropped', dropped.length)
const byWhy = {}
for (const [why] of dropped) byWhy[why] = (byWhy[why] || 0) + 1
console.log(byWhy)
for (const [why, c] of dropped) if (!/일 단위/.test(why)) console.log('  DROP', why, c.id, c.name, JSON.stringify(c.dataText), c.curP, c.orgP)
const byNet = {}
for (const k of kept) byNet[k.network + ' ' + k.generation] = (byNet[k.network + ' ' + k.generation] || 0) + 1
console.log(byNet)
