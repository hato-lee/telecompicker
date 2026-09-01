// 스마트초이스 요금제 목록 전체를 떠서 스냅샷으로 저장한다.
// 사용법: node scripts/fetch-smartchoice-list.mjs <저장경로.json>
// 주의: 목록 발견용이다. 값의 최종 근거는 각 사업자 공시 페이지로 대조한다 (설계 문서).

const OUT = process.argv[2]
if (!OUT) {
  console.error('사용법: node scripts/fetch-smartchoice-list.mjs <저장경로.json>')
  process.exit(1)
}

const ENDPOINT = 'https://www.smartchoice.or.kr/smc/plan/planCompareResult.do'
const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  Referer: 'https://www.smartchoice.or.kr/smc/plan/planCompare.do',
}
const base = {
  ageType: '1', // 일반
  dataSpeed: '',
  usageData: '',
  minUsageData: '0',
  maxUsageData: '999999',
  deviceTypeList: ['1'], // 휴대폰
  sort: '1',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ⭐ 세션 쿠키 없이 연속 POST 하면 6번쯤에서 대기 페이지(HTML)로 막힌다 (2026-09-01 실측).
//    목록 페이지를 먼저 GET 해서 받은 쿠키를 이후 요청에 실어 보낸다.
let cookie = ''
async function getSession() {
  const res = await fetch('https://www.smartchoice.or.kr/smc/plan/planCompare.do', {
    headers: { 'User-Agent': HEADERS['User-Agent'] },
  })
  cookie = (res.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(';')[0])
    .join('; ')
}

async function post(body) {
  // 연속 요청 6번쯤에서 막힌 적이 있다(2026-09-01) — 막히면 쉬었다가 다시 시도한다.
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { ...HEADERS, ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      process.stderr.write(`  막힘(시도 ${attempt}/4) — ${10 * attempt}초 쉬고 세션 새로 받아 재시도\n`)
      await sleep(10000 * attempt)
      await getSession()
    }
  }
  throw new Error('4번 시도해도 막혀 있다. 나중에 다시.')
}

await getSession()
const mno = []
const mvno = []
let mnoTotal = 0
let mvnoTotal = 0
for (let p = 1; p <= 15; p++) {
  const r = await post({ ...base, mnoPageNum: p, mnoAmount: 100, mvnoPageNum: p, mvnoAmount: 100 })
  mnoTotal = r.mnoPlanListCount
  mvnoTotal = r.mvnoPlanListCount
  mno.push(...(r.mnoPlanList ?? []))
  mvno.push(...(r.mvnoPlanList ?? []))
  process.stderr.write(`페이지 ${p}: mno ${mno.length}/${mnoTotal}, mvno ${mvno.length}/${mvnoTotal}\n`)
  if (mno.length >= mnoTotal && mvno.length >= mvnoTotal) break
  await sleep(2000)
}

const out = {
  fetchedAt: new Date().toISOString(),
  endpoint: `POST ${ENDPOINT}`,
  requestBase: base,
  note: 'ageType=1(일반) 전체 목록. 100개씩 페이지 순회. 발견용 — 최종 근거는 사업자 공시.',
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
