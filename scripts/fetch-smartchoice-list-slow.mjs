// 스마트초이스 목록을 아주 천천히 받는다 (차단이 걸린 뒤 재수집용).
// 사용법: node scripts/fetch-smartchoice-list-slow.mjs <저장경로.json> [시작전_대기_분]
// 요청 간 20초, 막히면 5분 쉬고 세션 새로. 2026-09-01: 연속 6번 요청에서 차단, 3분으로는 안 풀림.

const OUT = process.argv[2]
const WAIT_MIN = Number(process.argv[3] ?? '15')
if (!OUT) {
  console.error('사용법: node scripts/fetch-smartchoice-list-slow.mjs <저장경로.json> [대기_분]')
  process.exit(1)
}

const ENDPOINT = 'https://www.smartchoice.or.kr/smc/plan/planCompareResult.do'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
const base = {
  ageType: '1',
  dataSpeed: '',
  usageData: '',
  minUsageData: '0',
  maxUsageData: '999999',
  deviceTypeList: ['1'],
  sort: '1',
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = (s) => process.stderr.write(`[${new Date().toISOString().slice(11, 19)}] ${s}\n`)

let cookie = ''
async function getSession() {
  const res = await fetch('https://www.smartchoice.or.kr/smc/plan/planCompare.do', {
    headers: { 'User-Agent': UA },
  })
  cookie = (res.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ')
}

async function post(body) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': UA,
        Referer: 'https://www.smartchoice.or.kr/smc/plan/planCompare.do',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      log(`막힘(시도 ${attempt}/6) — 5분 쉬고 세션 새로`)
      await sleep(5 * 60 * 1000)
      await getSession()
    }
  }
  throw new Error('여섯 번 시도해도 막혀 있다.')
}

log(`시작 전 ${WAIT_MIN}분 대기`)
await sleep(WAIT_MIN * 60 * 1000)
await getSession()

const mno = []
const mvno = []
let mnoTotal = Infinity
let mvnoTotal = Infinity
for (let p = 1; p <= 15; p++) {
  const needMno = mno.length < mnoTotal
  const needMvno = mvno.length < mvnoTotal
  if (!needMno && !needMvno) break
  const r = await post({
    ...base,
    mnoPageNum: p,
    mnoAmount: needMno ? 100 : 1,
    mvnoPageNum: p,
    mvnoAmount: needMvno ? 100 : 1,
  })
  mnoTotal = r.mnoPlanListCount
  mvnoTotal = r.mvnoPlanListCount
  if (needMno) mno.push(...(r.mnoPlanList ?? []))
  if (needMvno) mvno.push(...(r.mvnoPlanList ?? []))
  log(`페이지 ${p}: mno ${mno.length}/${mnoTotal}, mvno ${mvno.length}/${mvnoTotal}`)
  await sleep(20000)
}

const out = {
  fetchedAt: new Date().toISOString(),
  endpoint: `POST ${ENDPOINT}`,
  requestBase: base,
  note: 'ageType=1(일반) 전체. 100개씩, 요청 간 20초. 발견용 — 최종 근거는 사업자 공시.',
  mnoPlanListCount: mnoTotal,
  mvnoPlanListCount: mvnoTotal,
  mnoReturned: mno.length,
  mvnoReturned: mvno.length,
  mnoPlanList: mno,
  mvnoPlanList: mvno,
}
const { writeFileSync, mkdirSync } = await import('node:fs')
const { dirname } = await import('node:path')
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(out, null, 1))
console.log(`저장: ${OUT} (mno ${mno.length}, mvno ${mvno.length})`)
