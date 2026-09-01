#!/usr/bin/env node
// SKT(T world) 요금제 원문 수집기 — 2026-09-01에 뚫은 내부 API를 그대로 두드린다.
//
// 길(자세한 설명은 data/carriers/skt/README.md):
//   1) 목록  GET /core-product/v1/product/mobile/plan-overall-list?idxCtgCd=F01100&size=500&page=1&order=
//            → result.mobilePlanList[] (prodId, prodNm, basFeeInfo, prodFltList …)
//   2) 요약  GET /core-product/v1/ledger/<prodId>/summaries
//   3) 공시  GET /core-product/v1/ledger/<prodId>/contents   ← 「이용 요금 및 기본 혜택」 표(부가세 포함)
//   사람이 보는 상세 페이지: https://www.tworld.co.kr/web/product/callplan/<prodId>
//
// 쓰는 법:
//   node scripts/fetch-skt-plans.mjs              # 목록만 받아 표로 보여준다
//   node scripts/fetch-skt-plans.mjs --dump <dir> # 목록 + 요금제별 summaries/contents 원문을 <dir>에 저장
//   node scripts/fetch-skt-plans.mjs --text <prodId>  # 한 요금제의 공시 본문을 글자로 뽑아 본다
//
// 쿠키·헤더 없이 그냥 열린다(2026-09-01 확인). playwright는 목록/상세 API를 찾을 때만 필요했다.

import fs from 'node:fs'
import path from 'node:path'

const BASE = 'https://www.tworld.co.kr'
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Referer: `${BASE}/web/product/plan/list`,
  Accept: 'application/json, text/plain, */*',
}

/** 목록 페이지가 쓰는 필터 분류 (BFF_10_0056 /core-product/v1/submain/filters?idxCtgCd=F01100) */
export const AGE_ONLY_FILTERS = [
  '만 12세 이하',
  '만 18세 이하',
  '만 34세 이하',
  '만 65세 이상',
  '만 70세 이상',
  '만 80세 이상',
  '복지',
  '군인',
]

async function getJson(url, referer) {
  const res = await fetch(url, { headers: { ...HEADERS, ...(referer ? { Referer: referer } : {}) } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const json = await res.json()
  if (json.code !== '00') throw new Error(`code=${json.code} ${url}`)
  return json
}

export async function fetchPlanList() {
  const url = `${BASE}/core-product/v1/product/mobile/plan-overall-list?idxCtgCd=F01100&size=500&page=1&order=`
  const { result } = await getJson(url)
  return result // { mobilePlanList, totalCount, ... }
}

export const summariesUrl = (prodId) => `${BASE}/core-product/v1/ledger/${prodId}/summaries`
export const contentsUrl = (prodId) => `${BASE}/core-product/v1/ledger/${prodId}/contents`
export const detailPageUrl = (prodId) => `${BASE}/web/product/callplan/${prodId}`

export async function fetchPlanDetail(prodId) {
  // ⚠️ ledger API는 Referer가 그 요금제의 상세 페이지여야 200이 온다 (아니면 401)
  const ref = detailPageUrl(prodId)
  const [summaries, contents] = await Promise.all([
    getJson(summariesUrl(prodId), ref),
    getJson(contentsUrl(prodId), ref),
  ])
  return { summaries: summaries.result, contents: contents.result }
}

/** 공시 HTML을 사람이 읽을 글자로 (표 구조는 잃는다 — 값 확인용) */
export function htmlToText(html) {
  return String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|tr|div|h\d|table|thead|tbody)>/gi, '\n')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function categorize(plan) {
  const names = (plan.prodFltList || []).map((f) => f.prodFltNm)
  if (names.includes('태블릿/스마트 기기')) return 'tablet-watch' // 휴대폰 회선 아님
  if (names.includes('선불폰')) return 'prepaid' // 선불(PPS) — 월정액 없음
  if (names.some((n) => AGE_ONLY_FILTERS.includes(n))) return 'age-only'
  return 'general'
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const argv = process.argv.slice(2)
  const textIdx = argv.indexOf('--text')
  if (textIdx >= 0) {
    const prodId = argv[textIdx + 1]
    const { contents } = await fetchPlanDetail(prodId)
    for (const c of contents.contentsList || []) {
      console.log(`\n##### ${c.titleNm}\n`)
      console.log(htmlToText(c.ledItmDesc))
    }
    return
  }

  const list = await fetchPlanList()
  console.log(`총 ${list.totalCount}개 (받은 것 ${list.mobilePlanList.length}개)`)
  for (const p of list.mobilePlanList) {
    console.log(
      [
        categorize(p).padEnd(13),
        p.prodId,
        p.prodNm,
        `${p.basFeeInfo}원`,
        `GB=${p.basOfrGbDataQtyCtt || '-'}`,
        `MB=${p.basOfrMbDataQtyCtt || '-'}`,
        `소진후=${p.qosDataQtyCtt || '-'}`,
        `통화=${p.basOfrVcallTmsCtt || '-'}`,
        `문자=${p.basOfrCharCntCtt || '-'}`,
      ].join(' | '),
    )
  }

  const dumpIdx = argv.indexOf('--dump')
  if (dumpIdx < 0) return
  const dir = argv[dumpIdx + 1]
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'plan-overall-list.json'), JSON.stringify(list, null, 2))
  for (const p of list.mobilePlanList) {
    const detail = await fetchPlanDetail(p.prodId)
    fs.writeFileSync(path.join(dir, `${p.prodId}.json`), JSON.stringify(detail, null, 2))
    process.stderr.write(`. ${p.prodId} ${p.prodNm}\n`)
    await sleep(300) // 예의상 쉼 (2026-09-01엔 막히지 않았다)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main()
