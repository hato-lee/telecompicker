import fs from 'node:fs'
const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const D = '2026-09-01'

const fmt = (n) => (n === null || n === undefined ? 'null' : n.toLocaleString('en-US'))

// ── 토스모바일 ────────────────────────────────────────────────
const tossRaw = JSON.parse(fs.readFileSync(`${ROOT}/data/carriers/toss/raw/toss-${D}.json`, 'utf8'))
const tossPlans = JSON.parse(fs.readFileSync(`${ROOT}/src/data/plans/toss.json`, 'utf8'))
const byCode = new Map(tossRaw.map((r) => [`${r.planCode}|${r.mnoCarrier}`, r]))

for (const p of tossPlans) {
  const code = decodeURIComponent(p.sourceUrl.split('/pricing/')[1].split('?')[0])
  const car = p.sourceUrl.split('carrier=')[1]
  const r = byCode.get(`${code}|${car}`)
  const dp = r.discountPolicyList[0] || null
  const disc = dp
    ? dp.numberOfMonths === null
      ? `평생 · 월 ${fmt(r.monthlyFee - dp.amount)}원 (정가 ${fmt(r.monthlyFee)}원)`
      : `${dp.numberOfMonths}개월 동안 월 ${fmt(r.monthlyFee - dp.amount)}원, 그 뒤 ${fmt(r.monthlyFee)}원`
    : '할인 표시 없음'
  const md = `# ${p.name} (${r.mnoCarrier} 망) — 원문에서 본 값 (${D} 확인)

- 원문(상세): ${p.sourceUrl}
- 목록: https://tossmobile.co.kr/pricing — 「${car === 'SKT' ? 'SKT 망' : car === 'KT' ? 'KT 망' : 'LG U+ 망'}」 탭 > 「${r.groupType.title}」
- 값의 출처: 목록·상세를 브라우저로 띄워 눈으로 읽은 값 + 그 화면이 부르는 내부 통로
  \`GET https://api-public.toss.im/api/v3/mvno-growth/products/homepage\` (planCode \`${r.planCode}\`)

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | ${r.displayName} |
| 망·세대 | ${r.mnoCarrier} / ${r.network} |
| 요금 | ${disc} |
| 데이터 | ${r.dataUsage.basicAmount}GB + ${r.dataUsage.speedLimit}${r.dataUsage.speedLimitUnit} (상세 「다 써도 ${r.dataUsage.speedLimit}Mbps 속도」) |
| 통화 | ${r.callUsage.type === 'UNLIMITED' ? '무제한' : r.callUsage.amount + '분'}${r.callUsage.extraAmount ? ` (영상 부가 통화 ${r.callUsage.extraAmount}분)` : ''} |
| 문자 | ${r.messageUsage.type === 'UNLIMITED' ? '무제한' : r.messageUsage.amount + '건'} |
| 핫스팟 | ${r.hotspotLimit}GB |
${dp ? `| 할인 마감 | 상세 「할인 혜택은 9월 1일 오후 8시 0분까지 가입해야 받을 수 있어요」 (통로 applyEndTs ${dp.applyEndTs}) |\n` : ''}
## 스키마에 담은 값

\`\`\`
id            ${p.id}
carrier       토스모바일 / mvno / network ${p.network}
generation    ${p.generation}
monthlyFee    ${p.monthlyFee}
promo         ${p.promo ? `{ months: ${p.promo.months}, feeDuring: ${p.promo.feeDuring} }` : 'null'}
dataGB        ${p.dataGB}
throttleMbps  ${p.throttleMbps}
voiceMinutes  ${p.voiceMinutes === null ? 'null (무제한)' : p.voiceMinutes}
smsIncluded   ${p.smsIncluded}
\`\`\`

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(캐시백·CU 20% 할인·페이스페이 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 부가세 포함 여부를 원문이 말하지 않는다 — 화면 표시가를 그대로 담았다.
`
  fs.writeFileSync(`${ROOT}/data/carriers/toss/sources/${p.id}-${D}-collect.md`, md)
}
console.log('toss snapshots', tossPlans.length)

// ── 아이즈모바일 ──────────────────────────────────────────────
const eyesRaw = JSON.parse(fs.readFileSync(`${ROOT}/data/carriers/eyes/raw/eyes-${D}.json`, 'utf8'))
const eyesPlans = JSON.parse(fs.readFileSync(`${ROOT}/src/data/plans/eyes.json`, 'utf8'))
const byUrl = new Map(eyesRaw.map((r) => [r.url, r]))

for (const p of eyesPlans) {
  const r = byUrl.get(p.sourceUrl)
  const discRows = r.discount
    ? r.discount.map((d) => `| ${d.label} | ${fmt(d.price)}원 |`).join('\n')
    : '| (할인 표시 없음) | — |'
  const md = `# ${p.name} — 원문에서 본 값 (${D} 확인)

- 원문(상세): ${p.sourceUrl}
- 목록: https://www.eyes.co.kr/payplan/all_plan (「전체 요금제」, 한 쪽 20개 × 12쪽)
- 값의 출처: 목록 카드 + 상세 페이지 「요금할인 정보」 표

## 화면에 적힌 그대로

| 칸 | 원문 |
|---|---|
| 요금제 | ${r.name} |
| 배지 | ${r.badges.map((b) => b.text).join(' · ')} |
| 데이터 | ${r.dataText.join(' + ')} |
| 통화 | ${r.infoLines[0] || '—'} |
| 문자 | ${r.infoLines[1] || '—'} |
| 정가(취소선) | ${r.orgP || '없음'} |
| 표시가 | ${r.period ? r.period + ' ' : ''}${r.curP} |
${r.benefits.length ? `| 제휴 혜택 | ${r.benefits.join(' / ')} |\n` : ''}
### 상세 「요금할인 정보」 표

| 기간 | 월 요금 |
|---|---|
${discRows}

## 스키마에 담은 값

\`\`\`
id            ${p.id}
carrier       아이즈모바일 / mvno / network ${p.network}
generation    ${p.generation}${p.generation === 'LTE' && !/\(LTE\)/i.test(r.name) ? '  ← ⚠️ 원문이 세대를 말하지 않는다. 이름에 「5G」가 없어 LTE로 담음' : ''}
monthlyFee    ${p.monthlyFee}
promo         ${p.promo ? `{ months: ${p.promo.months}, feeDuring: ${p.promo.feeDuring} }` : 'null'}
dataGB        ${p.dataGB}
throttleMbps  ${p.throttleMbps}
voiceMinutes  ${p.voiceMinutes === null ? 'null (무제한)' : p.voiceMinutes}
smsIncluded   ${p.smsIncluded}
\`\`\`

## 담지 않은 것 (원문엔 있으나 규칙상 제외)

- 제휴 혜택(상품권·구독권·편의점 할인 등)은 요금이 아니라 덤이라 담을 그릇이 없다.
- 「SOLO 결합 시 추가 데이터」류는 결합할인 — 이번 범위 밖(DECIDED).
- 부가세 포함 여부를 원문이 따로 말하지 않는다 — 화면 표시가를 그대로 담았다.
`
  fs.writeFileSync(`${ROOT}/data/carriers/eyes/sources/${p.id}-${D}-collect.md`, md)
}
console.log('eyes snapshots', eyesPlans.length)
