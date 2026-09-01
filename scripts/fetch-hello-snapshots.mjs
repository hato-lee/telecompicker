#!/usr/bin/env node
/**
 * 헬로모바일 원문 스냅샷 만들기 — data/carriers/hello/sources/*.md
 *
 * 원문은 화면(HTML)이 아니라 화면이 부르는 통로(ajaxRateList.do)의 JSON 한 줄이다.
 * 그래서 스냅샷마다 **그 줄을 그대로** 붙이고, 화면이 그 줄로 그리는 글자를
 * 사이트 자신의 그리기 규칙(usim 목록 페이지 인라인 스크립트)으로 되살려 함께 적는다.
 *
 * 쓰는 법: node scripts/fetch-hello-snapshots.mjs
 * ⚠️ 이미 있는 스냅샷은 덮어쓰지 않는다(수집 규약). 새로 찍으려면 날짜를 바꿔라.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fetchRaw, excludeReason, toPlan } from './fetch-hello-plans.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = `${ROOT}/data/carriers/hello/sources`
const CHECKED_AT = '2026-09-01'
const PAGE_URL = 'https://direct.lghellovision.net/rate/rateViewUsim.do?pgNum=0301&rateGubun=U'

// 사이트 자신의 코드표 (usim 목록 페이지 인라인 스크립트에서 그대로)
const dataNmMap = { G: 'GB', M: 'MB' }
const dataDelMap = { 1: '400Kbps', 2: '1Mbps', 3: '3Mbps', 4: '5Mbps', 5: '10Mbps' }
const priceGbMap = { J: '청소년', S: '시니어', T: '패드', P: '혜택 요금제', D: '데이터 더주는', C: '쿠폰팩', U: 'U+결합할인' }

const dec = (s) =>
  String(s ?? '').replace(/&#40;/g, '(').replace(/&#41;/g, ')').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim()

/** 사이트의 fnRateNm() — 머리줄(데이터 줄) 글자를 되살린다 */
function headline(it) {
  const { dedicatedMonthlyOfferGubun: mg, dedicatedMonthlyOfferValue: mv } = it
  const { dedicatedDailyOfferGubun: dg, dedicatedDailyOfferValue: dv } = it
  const depl = it.dedicatedDataDepletionRate
  let extra = ''
  if (dv) extra += ` +일 ${dv}${dataNmMap[dg] || ''}`
  if (depl && depl !== '0') extra += ` +${dataDelMap[Number(depl)]} 무제한`
  return mv ? `${mv}${dataNmMap[mg] || ''}${extra}` : `일${dv}${dataNmMap[dg] || ''}${extra}`
}
const callNm = (it) => (it.dedicatedCallsGubun === 'L' ? '기본제공' : `${it.dedicatedCallsValue}분`)
const smsNm = (it) => (it.dedicatedSmsGubun === 'L' ? '기본제공' : `${it.dedicatedSmsValue}건`)
/** 사이트의 가격 옆 딱지 — 'A'면 「평생요금」, 아니면 「N개월 후 M원」 */
const priceType = (it) =>
  it.directPromotionInfotext === 'A'
    ? '평생요금'
    : `${it.directPromotionAfterMonthChk}개월 후 ${Number(it.directPromotionAfterPrice).toLocaleString('en-US')}원`
const won = (n) => Number(n).toLocaleString('en-US')

function snapshot(it, plan, why) {
  const name = dec(it.salesName)
  const net = it.telecom === 'LGU' ? 'LG U+ 망' : 'KT 망'
  const pg = priceGbMap[it.dedicatedPriceGubun] || '(없음)'
  const lines = []
  lines.push(`# ${name} — 원문에서 본 값 (${CHECKED_AT} 확인)`)
  lines.push('')
  lines.push(`- 원문 화면: <${PAGE_URL}> · 「유심 요금제」 목록 (망 고르개: ${net})`)
  lines.push(
    '- 값의 출처: 그 화면이 부르는 통로 `POST https://direct.lghellovision.net/fund/ajaxRateList.do` (body `reqRateType=U`) 의 `list[]` 한 줄'
  )
  lines.push(`- 요금제코드: \`${it.paymentcode}\``)
  lines.push(`- 확인 날짜: ${CHECKED_AT}`)
  lines.push('')
  lines.push('## 화면에 그려지는 글자 (사이트 자신의 그리기 규칙으로 되살림)')
  lines.push('')
  lines.push('| 칸 | 원문 |')
  lines.push('|---|---|')
  lines.push(`| 요금제명 | ${name} |`)
  lines.push(`| 머리줄(데이터) | ${headline(it)} |`)
  lines.push(`| 망 | ${net} |`)
  lines.push(`| 세대 | ${it.usimType} |`)
  lines.push(`| 통화 | ${callNm(it)} |`)
  lines.push(`| 문자 | ${smsNm(it)} |`)
  lines.push(`| 분류 딱지 | ${pg} |`)
  lines.push(`| 가격 옆 딱지 | ${priceType(it)} |`)
  lines.push(`| 월 요금 | ${won(it.directPromotionDirectmallPrice)}원 (부가세 포함 — 유의사항 「월 기본료 및 국내 통화료는 부가세 포함금액입니다」) |`)
  lines.push('')
  lines.push('## 원문 한 줄 그대로 (통로가 준 JSON, 사은품 목록만 덜어냄)')
  lines.push('')
  lines.push('```json')
  lines.push(JSON.stringify({ ...it, benefitList: `(사은품 ${it.benefitList?.length ?? 0}건 — 요금이 아니라 담지 않는다)` }, null, 1))
  lines.push('```')
  lines.push('')
  if (why) {
    lines.push('## 담지 않았다')
    lines.push('')
    lines.push(`- **${why}**`)
    lines.push('- 빠뜨린 것이 아니라 규칙상 뺀 것이다.')
  } else {
    lines.push('## 스키마에 담은 값 (src/data/plans/hello.json)')
    lines.push('')
    lines.push('```json')
    lines.push(JSON.stringify(plan, null, 1))
    lines.push('```')
    lines.push('')
    lines.push('### 왜 이 값인가')
    lines.push('')
    if (plan.promo) {
      lines.push(
        `- \`monthlyFee\` ${won(plan.monthlyFee)}원 / \`promo\` ${plan.promo.months}개월 ${won(plan.promo.feeDuring)}원 — 원문 가격 옆 딱지가 「${priceType(it)}」이고 큰 숫자가 ${won(it.directPromotionDirectmallPrice)}원이다. 즉 앞 ${plan.promo.months}달은 할인가, 그 뒤가 제값.`
      )
    } else {
      lines.push(
        `- \`monthlyFee\` ${won(plan.monthlyFee)}원 — 원문 가격 옆 딱지가 「평생요금」이다. 기간 한정 할인이 아니라 계속 내는 값이므로 \`promo\`는 \`null\`.`
      )
    }
    lines.push(
      `- \`dataGB\` ${plan.dataGB} / \`throttleMbps\` ${plan.throttleMbps === null ? 'null (소진 후 제공 없음)' : plan.throttleMbps}`
    )
    lines.push(
      `- \`voiceMinutes\` ${plan.voiceMinutes === null ? 'null (기본제공=무제한)' : plan.voiceMinutes} / \`smsIncluded\` ${plan.smsIncluded}`
    )
    if (it.dedicatedDailyOfferValue) {
      lines.push(
        `- ⚠️ 원문에 「+일 ${it.dedicatedDailyOfferValue}${dataNmMap[it.dedicatedDailyOfferGubun] || ''}」 추가 제공이 더 있으나 **담지 않았다** — 스키마에 일 단위 그릇이 없다(DECIDED 2026-09-01). 적게 세는 쪽이다.`
      )
    }
    if ((it.salesBadge || '').split(', ').includes('C')) {
      lines.push('- ⚠️ 원문 딱지 「U+결합할인」 대상. 결합할인 금액은 이번 범위 밖(DECIDED)이라 담지 않았다.')
    }
  }
  lines.push('')
  return lines.join('\n')
}

const list = await fetchRaw()
mkdirSync(DIR, { recursive: true })
let wrote = 0
let skipped = 0
for (const it of list) {
  const why = excludeReason(it)
  const plan = why ? null : toPlan(it)
  // 담지 않은 줄도 스냅샷을 남긴다 — 「안 담았다」도 이력이다
  const id = plan ? plan.id : `hello-x-${it.paymentcode.toLowerCase()}`
  const path = `${DIR}/${id}-${CHECKED_AT}-${why ? 'excluded' : 'collect'}.md`
  if (existsSync(path)) {
    skipped++
    continue
  }
  writeFileSync(path, snapshot(it, plan, why))
  wrote++
}
console.log(`스냅샷 ${wrote}개 씀 / ${skipped}개는 이미 있어 건드리지 않음 (원문 ${list.length}줄)`)
