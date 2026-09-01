#!/usr/bin/env node
// LG유플러스 휴대폰 요금제 수집 — 목록 + 상세 원문 긁기
//
// 쓰는 법 (저장소 뿌리에서):
//   node scripts/fetch-lgu-plans.mjs            → data/carriers/lgu/raw/lgu-<오늘>.json
//   node scripts/fetch-lgu-plans.mjs <출력경로>
//
// 길 요약 (자세한 건 data/carriers/lgu/README.md):
//  ① 목록 「통합」탭: https://www.lguplus.com/mobile/plan/mplan/plan-all 를 playwright로 렌더.
//     요금제는 접힌 아코디언 안에 이미 DOM으로 들어 있다 (a.mobile-planList-link).
//     연령 하위탭(키즈/청소년/청년/시니어/외국인/복지)과 LTE 하위탭은 클릭해야 갈린다.
//  ② 목록 「온라인 가입 전용」탭(너겟·LTE 다이렉트): 내부 API 하나로 끝난다.
//     POST /uhdc/fo/prdv/mblppexhi/v2/list:get
//     body {"menuId":"M20162","ppSortType":"SALE_ASC","ageGrpCd":"","mblPpExhiFilterCondList":[]}
//     (menuId는 GET /uhdc/fo/fcmm/fome/v1/meid?menuLinkUrl=<경로> 로 얻는다)
//     ⚠️ 「통합」탭 menuId(M21311)로 부르면 빈 목록이 온다 — 통합 탭은 전시(display) 구좌라서.
//  ③ 값의 최종 근거는 각 요금제 상세 페이지. 렌더 후 .plan-title/.price-summary/.plan-list 를 읽는다.

import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const BASE = 'https://www.lguplus.com'
const LIST_URL = `${BASE}/mobile/plan/mplan/plan-all`
const DIRECT_URL = `${BASE}/mobile/plan/mplan/direct`
const today = new Date().toISOString().slice(0, 10)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** 목록 페이지의 하위탭을 하나씩 눌러 a.mobile-planList-link 를 긁는다 */
function scrapeListLinks() {
  const out = []
  document.querySelectorAll('a.mobile-planList-link').forEach((a) => {
    const g = (sel) => (a.querySelector(sel)?.innerText || '').replace(/\s+/g, ' ').trim()
    out.push({
      href: a.getAttribute('href'),
      listName: g('.mobile-planList-th'),
      listPrice: g('.mobile-planList-td--price'),
      listData: g('.mobile-planList-td--td01'),
      listVoice: g('.mobile-planList-td--td02'),
      listSms: g('.mobile-planList-td--td03'),
    })
  })
  // 같은 요금제가 「전체 요약 구좌」와 「아코디언」에 두 번 나온다 → href로 하나만
  const seen = new Set()
  return out.filter((r) => (seen.has(r.href) ? false : (seen.add(r.href), true)))
}

/** 상세 페이지에서 원문 값을 그대로 옮긴다 */
function scrapeDetail() {
  const t = (el) => (el?.innerText || '').replace(/\s+/g, ' ').trim()
  const items = {}
  document.querySelectorAll('.plan-info .plan-list__item').forEach((li) => {
    const k = t(li.querySelector('.plan-list__title'))
    const v = t(li.querySelector('.plan-list__text'))
    if (k) items[k] = v
  })
  const segments = [...document.querySelectorAll('.premium-list__item')].map((li) => ({
    label: t(li.querySelector('strong.premium-list__title')),
    href: li.querySelector('a')?.getAttribute('href') || '',
    lines: [...li.querySelectorAll('.premium-list__title, .premium-list__text')].map(t),
  }))
  return {
    title: t(document.querySelector('.plan-title')),
    flags: [...document.querySelectorAll('.plan-flag__item')].map(t),
    features: [...document.querySelectorAll('.plan-features__item')].map(t),
    priceSummary: t(document.querySelector('.price-summary')),
    priceNote: t(document.querySelector('.price-discount__text')),
    priceDiscount: t(document.querySelector('.price-discount__price')),
    items,
    segments,
    // 기간 한정 할인(프로모션) 흔적이 있으면 통째로 담아 사람이 판단하게 한다
    promoHints: [...document.querySelectorAll('#cSection *')]
      .filter((e) => e.children.length === 0 && /(개월|한시적|프로모션|기간 한정)/.test(e.textContent || ''))
      .map((e) => e.textContent.replace(/\s+/g, ' ').trim())
      .filter((s) => s && s.length < 160)
      .slice(0, 20),
    bodyText: document.querySelector('#cSection')?.innerText || '',
  }
}

async function main() {
  const outPath =
    process.argv[2] || path.join('data', 'carriers', 'lgu', 'raw', `lgu-${today}.json`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 2200 } })

  // ── ① 통합 탭 (하위탭별 목록)
  const page = await ctx.newPage()
  await page.goto(LIST_URL, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await sleep(8000)
  const tabNames = await page.$$eval('.plan-sub-tab-menu a', (els) =>
    els.map((e) => e.innerText.trim()),
  )
  const tabs = {}
  for (let i = 0; i < tabNames.length; i++) {
    const els = await page.$$('.plan-sub-tab-menu a')
    await els[i].click()
    await sleep(5000)
    tabs[tabNames[i]] = await page.evaluate(scrapeListLinks)
    console.error(`[목록] ${tabNames[i]}: ${tabs[tabNames[i]].length}개`)
  }
  await page.close()

  // ── ② 온라인 가입 전용 탭 (내부 API)
  const api = await ctx.request.post(`${BASE}/uhdc/fo/prdv/mblppexhi/v2/list:get`, {
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/plain, */*',
      'x-user-agent-type': 'PC',
      'x-menu-url': '/mobile/plan/mplan/direct',
      referer: DIRECT_URL,
    },
    data: { menuId: 'M20162', ppSortType: 'SALE_ASC', ageGrpCd: '', mblPpExhiFilterCondList: [] },
  })
  const direct = (await api.json()).pricePlanList || []
  console.error(`[목록] 온라인 가입 전용: ${direct.length}개`)

  // ── ③ 상세 페이지
  const targets = new Map()
  for (const [tab, rows] of Object.entries(tabs))
    for (const r of rows) targets.set(r.href, { ...r, tab, source: 'list' })
  for (const d of direct) {
    const href = `/mobile${d.mblPpExhiMenu?.menuUrl || '/plan/mplan/direct'}/${d.urcMblPpCd}`
    targets.set(href, {
      href,
      tab: '온라인 가입 전용',
      source: 'api',
      listName: d.urcMblPpNm,
      apiRow: {
        code: d.urcMblPpCd,
        basePrice: d.urcPpBasfAmt, // 공시 정가(월정액, 부가세 포함)
        finalPrice: d.finalDcntAmt, // 할인 반영가
        promoName: d.ppMapgPmtnNm,
        promoDiscount: d.mblMcnPpPmtnDcntAmt,
        kind: d.urcMblProdPpKndNm, // 5G / LTE
        divs: d.urcMblProdPpDivsNm, // 일반 / …
        majors: d.mblPpExhiMajrInfoList?.map((m) => ({
          item: m.urcMblProdPpMajrItemCdNm,
          qty: m.mblProdPpScrnOfqnNm,
          desc: m.mblProdPpOfqnCntn,
        })),
      },
    })
  }

  const details = []
  const dp = await ctx.newPage()
  for (const [href, meta] of targets) {
    const url = BASE + href
    try {
      await dp.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
      await sleep(6000)
      const d = await dp.evaluate(scrapeDetail)
      details.push({ ...meta, url, detail: d })
      console.error(`[상세] ${d.title || meta.listName} — ${d.priceSummary}`)
    } catch (e) {
      details.push({ ...meta, url, error: String(e.message) })
      console.error(`[상세 실패] ${url}: ${e.message}`)
    }
  }
  await dp.close()
  await browser.close()

  fs.writeFileSync(outPath, JSON.stringify({ checkedAt: today, tabs, direct, details }, null, 1))
  console.error(`\n저장: ${outPath} (상세 ${details.length}건)`)
}

main()
