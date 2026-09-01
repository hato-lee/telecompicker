#!/usr/bin/env node
/**
 * 헬로모바일(LG헬로비전) 유심/eSIM 요금제 수집기 — 2026-09-01
 *
 * 길: 공식 다이렉트몰 https://direct.lghellovision.net
 *   목록 화면  /rate/rateViewUsim.do?pgNum=0301&rateGubun=U   (「유심 요금제」)
 *   실제 통로  POST /fund/ajaxRateList.do   body: reqRateType=U   → { list: [...] }
 *   유의사항   POST /phone/commNoticeNew.do body: paymentCode=<코드>&itemGubun=USIM&cpGubun=C
 *
 * 자세한 길 설명과 함정은 data/carriers/hello/README.md 를 읽어라.
 *
 * 쓰는 법:
 *   node scripts/fetch-hello-plans.mjs            # src/data/plans/hello.json 다시 만든다
 *   node scripts/fetch-hello-plans.mjs --raw out/ # 원문 JSON도 그 폴더에 떨군다
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CHECKED_AT = '2026-09-01'
const LIST_URL = 'https://direct.lghellovision.net/fund/ajaxRateList.do'
const PAGE_URL = 'https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

// 원문 코드표 (usim 목록 페이지 인라인 스크립트에서 그대로 옮김)
//   dataDelMap  = {1:'400Kbps', 2:'1Mbps', 3:'3Mbps', 4:'5Mbps', 5:'10Mbps'}
const THROTTLE_MBPS = { 1: 0.4, 2: 1, 3: 3, 4: 5, 5: 10 }
//   priceGbMap = {J:'청소년', S:'시니어', T:'패드', P:'혜택 요금제', D:'데이터 더주는', C:'쿠폰팩', U:'U+결합할인'}
const PRICE_GUBUN = { J: '청소년', S: '시니어', T: '패드', P: '혜택 요금제', D: '데이터 더주는', C: '쿠폰팩', U: 'U+결합할인' }

/** 원문이 HTML 엔티티로 주는 이름을 사람이 읽는 글자로 되돌린다. */
function decodeName(s) {
  return String(s ?? '')
    .replace(/&#40;/g, '(')
    .replace(/&#41;/g, ')')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim()
}

// 이름 → 영문 슬러그. 긴 말부터 바꾼다.
const SLUG_WORDS = [
  ['[혜택형]', ' benefit '],
  ['5G유심', ' 5g usim '],
  ['데이터 걱정없는', ' data-worryfree '],
  ['DATA 걱정없는', ' data-worryfree '],
  ['착한 페이백 데이터', ' chakhan-payback-data '],
  ['The 착한 데이터', ' the-chakhan-data '],
  ['데이터 더주는', ' data-more '],
  ['통화 데이터 넉넉히', ' call-data-plenty '],
  ['통화 맘편히', ' call-easy '],
  ['쿠폰팩', ' couponpack '],
  ['조건없는', ' nocondition '],
  ['보편 안심', ' bopyeon-ansim '],
  ['보편', ' bopyeon '],
  ['슬림 안심', ' slim-ansim '],
  ['슬림', ' slim '],
  ['안심보험', ' ansim-insurance '],
  ['교보문고', ' kyobo '],
  ['현대홈쇼핑', ' hyundai '],
  ['토이저러스 키즈', ' toysrus-kids '],
  ['중간요금제', ' mid '],
  ['데이터플러스', ' data-plus '],
  ['데이터', ' data '],
  ['청소년', ' teen '],
  ['시니어', ' senior '],
  ['복지', ' welfare '],
  ['헬로', ' hello '],
  ['유심', ' usim '],
  ['USIM', ' usim '],
  ['표준', ' standard '],
  ['수다', ' suda '],
  ['라이트', ' lite '],
  ['스탠다드', ' standard '],
  ['스페셜', ' special '],
  ['사과', ' sagwa '],
  ['안심', ' ansim '],
  ['패드', ' pad '],
  ['일', ' daily '],
  ['분', ' min '],
]

function slugify(name) {
  let s = decodeName(name)
  for (const [ko, en] of SLUG_WORDS) s = s.split(ko).join(en)
  s = s
    .toLowerCase()
    .replace(/\(new\)/g, ' new ')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s
}

function planId(name, telecom) {
  let s = slugify(name)
  if (s.startsWith('hello-')) s = s.slice('hello-'.length) // hello-hello-… 방지
  return `hello-${s}-${telecom === 'KT' ? 'kt' : 'lgu'}`
}

/** 담지 않을 요금제인지 — 담지 않는 이유를 돌려준다(담으면 null). */
export function excludeReason(item) {
  const name = decodeName(item.salesName)
  const pg = item.dedicatedPriceGubun || ''
  if (pg === 'T') return '패드(태블릿) 요금제 — 휴대폰 요금제가 아니다'
  if (pg === 'J') return '청소년·키즈 전용 — 나이 자격 제한'
  if (pg === 'S') return '시니어 전용 — 나이 자격 제한'
  if (/키즈/.test(name)) return '키즈 전용 — 나이 자격 제한'
  if (/복지/.test(name)) return '복지 대상 전용 — 자격 제한'
  if (!item.dedicatedMonthlyOfferValue && item.dedicatedDailyOfferValue)
    return '일 단위 데이터 요금제 — 스키마에 그릇이 없다(DECIDED 2026-09-01)'
  return null
}

export function toPlan(item) {
  const name = decodeName(item.salesName)
  const network = item.telecom === 'KT' ? 'KT' : 'LGU+'
  const generation = item.usimType === '5G' ? '5G' : 'LTE'

  // 데이터: 월 기본제공량. G=GB, M=MB(다른 계열과 맞춰 1000으로 나눈다)
  const monthGb = item.dedicatedMonthlyOfferGubun
  const monthVal = Number(item.dedicatedMonthlyOfferValue)
  const dataGB = monthGb === 'M' ? Number((monthVal / 1000).toFixed(4)) : monthVal

  // 소진 후 속도제어. 0/빈칸 = 소진 후 제공 없음
  const depl = item.dedicatedDataDepletionRate
  const throttleMbps = THROTTLE_MBPS[Number(depl)] ?? null

  // 통화: L = 기본제공(무제한) → null, B = 분 단위
  const voiceMinutes = item.dedicatedCallsGubun === 'L' ? null : Number(item.dedicatedCallsValue || 0)
  // 문자: L = 기본제공, B = 건 단위(0건이면 미포함)
  const smsIncluded = item.dedicatedSmsGubun === 'L' ? true : Number(item.dedicatedSmsValue || 0) > 0

  // 값: directPromotionDirectmallPrice = 다이렉트몰 판매가(부가세 포함)
  //   directPromotionInfotext === 'A' → 화면에 「평생요금」  = 이 값이 계속 내는 값
  //   그 밖 → 화면에 「N개월 후 M원」 = N개월 특가, 이후 M원
  const salePrice = Number(item.directPromotionDirectmallPrice)
  const afterMonths = Number(item.directPromotionAfterMonthChk || 0)
  const afterPrice = Number(item.directPromotionAfterPrice || 0)
  const lifetime = item.directPromotionInfotext === 'A'

  let monthlyFee
  let promo = null
  const memo = []

  if (lifetime) {
    monthlyFee = salePrice
    memo.push('원문 가격 옆 표시 「평생요금」 — 이 값이 계속 내는 월정액이다(기간 한정 할인 아님).')
  } else if (afterMonths > 0 && afterPrice > 0) {
    monthlyFee = afterPrice
    promo = {
      months: afterMonths,
      feeDuring: salePrice,
      note: `원문 표시 「${afterMonths}개월 후 ${afterPrice.toLocaleString('en-US')}원」`,
    }
    memo.push(
      `원문 유의사항 「${afterMonths}개월간 추가할인 프로모션이 적용될 경우, 신규가입에 한 해 적용되며 요금제 변경 시 제외됩니다.」`
    )
  } else {
    // 원문이 기간을 말하지 않는 자리 — 지어내지 않는다
    monthlyFee = salePrice
    memo.push('할인가가 보이나 기간을 원문이 말하지 않는다 — 판매가를 그대로 담았다.')
  }

  memo.push('부가세: 원문 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」.')

  if (item.dedicatedDailyOfferValue) {
    const unit = item.dedicatedDailyOfferGubun === 'M' ? 'MB' : 'GB'
    memo.push(
      `원문 머리줄에 「+일 ${item.dedicatedDailyOfferValue}${unit}」 추가 제공이 더 있으나 담지 않았다 — 스키마에 일 단위 그릇이 없다(DECIDED 2026-09-01).`
    )
  }
  const pgName = PRICE_GUBUN[item.dedicatedPriceGubun]
  if (pgName) memo.push(`원문 분류 딱지 「${pgName}」.`)
  if ((item.salesBadge || '').split(', ').includes('C')) {
    memo.push('원문 딱지 「U+결합할인」 대상 — 결합할인 값은 이번 범위 밖이라 담지 않았다.')
  }
  if (item.dedicatedViedocallsGubun === 'B' && item.dedicatedViedocallsValue) {
    memo.push(`영상·부가통화 ${item.dedicatedViedocallsValue}분(스키마에 그릇 없음).`)
  }
  memo.push(`원문 요금제코드 ${item.paymentcode}.`)

  return {
    id: planId(name, item.telecom),
    carrier: '헬로모바일',
    carrierType: 'mvno',
    network,
    name,
    generation,
    monthlyFee,
    promo,
    dataGB,
    throttleMbps,
    voiceMinutes,
    smsIncluded,
    sourceUrl: PAGE_URL,
    checkedAt: CHECKED_AT,
    memo: memo.join(' '),
  }
}

export async function fetchRaw() {
  const res = await fetch(LIST_URL, {
    method: 'POST',
    headers: {
      'User-Agent': UA, // ⚠️ 없으면 400 Bad Request
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: PAGE_URL,
    },
    body: 'reqRateType=U',
  })
  if (!res.ok) throw new Error(`ajaxRateList.do ${res.status}`)
  const json = await res.json()
  if (!Array.isArray(json.list)) throw new Error('원문에 list가 없다')
  return json.list
}

async function main() {
  const rawDirFlag = process.argv.indexOf('--raw')
  const list = await fetchRaw()
  if (rawDirFlag > -1 && process.argv[rawDirFlag + 1]) {
    const dir = process.argv[rawDirFlag + 1]
    mkdirSync(dir, { recursive: true })
    writeFileSync(`${dir}/hello-usim-raw-${CHECKED_AT}.json`, JSON.stringify({ list }, null, 1))
  }

  const kept = []
  const dropped = []
  for (const item of list) {
    const why = excludeReason(item)
    if (why) dropped.push([decodeName(item.salesName), item.telecom, why])
    else kept.push(toPlan(item))
  }

  // 지킴이: id 규칙과 중복
  const bad = kept.filter((p) => !/^[a-z0-9-]+$/.test(p.id))
  if (bad.length) throw new Error(`id에 담을 수 없는 글자: ${bad.map((p) => p.id).join(', ')}`)
  const seen = new Map()
  for (const p of kept) {
    if (seen.has(p.id)) throw new Error(`id가 겹친다: ${p.id} (${seen.get(p.id)} / ${p.name})`)
    seen.set(p.id, p.name)
  }

  kept.sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync(`${ROOT}/src/data/plans/hello.json`, JSON.stringify(kept, null, 1) + '\n')

  console.log(`원문 ${list.length}개 → 담음 ${kept.length}개 / 뺌 ${dropped.length}개`)
  const byWhy = {}
  for (const [, , why] of dropped) byWhy[why] = (byWhy[why] || 0) + 1
  for (const [why, n] of Object.entries(byWhy)) console.log(`  뺌 ${n}: ${why}`)
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  await main()
}
