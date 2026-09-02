// KT 「연령별 덤」 공시 페이지를 떠서 덤별 표를 통째로 찍는다. (스쿨덤 / Y덤 / 65+덤 / 75+덤)
//
// 사용법:
//   node scripts/fetch-kt-dum.mjs            # 표 8개를 stdout에
//   node scripts/fetch-kt-dum.mjs <경로.md>  # 파일로 저장
//
// ⭐ 길 (2026-09-02 뚫음) — playwright가 필요 없다. 정적 HTML에 표가 통째로 들어 있다.
//   https://product.kt.com/benefit/membership/web/benefit.html   (PC)
//   https://m.product.kt.com/benefit/membership/mobile/benefit.html (모바일, 같은 내용)
//
// 이 한 페이지가 덤의 ①적용 대상 요금제 목록 ②나이 조건 ③「총 제공량」을 다 갖고 있다.
// 요금제 상세(productDetail.do)의 연령 탭을 playwright로 클릭해 긁을 필요가 없다.
//
// 표 차례 (2026-09-02 기준):
//   1 스쿨덤 제공량 · 2 스쿨덤 스마트기기 할인 · 3 Y덤 제공량 · 4 Y덤 스마트기기/키즈 할인
//   5 65+덤 제공량 · 6 75+덤 제공량 · 7 군인 혜택 · 8 복지 혜택
//
// ⚠️ 요고(온라인 전용)는 이 페이지에 없다. 요고의 Y덤은 요고 상세 아코디언에만 있고
//    12개월 데이터 추가 프로모션과 섞여 있어 덤만 따로 떼어낼 수 없다 (README 참고).

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
export const DUM_URL = 'https://product.kt.com/benefit/membership/web/benefit.html'

const strip = (h) =>
  h
    .replace(/<br\s*\/?>/gi, ' / ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export async function fetchDumPage() {
  return await (await fetch(DUM_URL, { headers: { 'User-Agent': UA } })).text()
}

/** 표 하나를 「행 | 칸 | 칸」 문자열 배열로. rowspan/colspan은 펴지 않는다(원문 그대로 본다). */
export function tablesOf(html) {
  return html.split('<table').slice(1).map((tb) =>
    [...tb.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) =>
      [...m[1].matchAll(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/g)].map((c) => strip(c[2])).join(' | '),
    ),
  )
}

/** 표를 뺀 본문 글줄 (나이 문구·「자동 가입」 유의사항이 여기 있다). */
export function notesOf(html) {
  return html
    .replace(/<table[\s\S]*?<\/table>/g, '\n[표]\n')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h\d|div|dd|dt)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((x) => x.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const html = await fetchDumPage()
  const lines = []
  lines.push(`# KT 연령별 덤 — 원문 덤프 (${new Date().toISOString().slice(0, 10)})`, '', `- 원문: ${DUM_URL}`, '')
  lines.push('## 본문 글줄', '')
  for (const l of notesOf(html)) lines.push(l)
  lines.push('', '## 표', '')
  tablesOf(html).forEach((rows, i) => {
    lines.push(`### 표 ${i + 1}`, '')
    for (const r of rows) lines.push(r)
    lines.push('')
  })
  const out = process.argv[2]
  if (out) {
    const { writeFileSync, mkdirSync } = await import('node:fs')
    const { dirname } = await import('node:path')
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, lines.join('\n'))
    console.log(`저장: ${out}`)
  } else {
    console.log(lines.join('\n'))
  }
}
