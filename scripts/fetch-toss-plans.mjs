// 토스모바일 요금제 긁기 — 2026-09-01
//
// 길: 요금제 페이지(https://tossmobile.co.kr/pricing)는 Next.js인데
//     __NEXT_DATA__ 의 pageProps 가 **비어 있다**(브라우저가 나중에 부른다).
//     통로는 페이지 chunk 안에 적혀 있다:
//       chunks/pages/pricing-*.js → "/api/v3/mvno-growth/products/homepage"
//       호스트는 같은 chunk 의 "https://api-public.toss.im"
//     → GET https://api-public.toss.im/api/v3/mvno-growth/products/homepage
//       (세션·쿠키·헤더 없이 200. 47개 전부를 한 번에 준다)
//
// 쓰는 법: node scripts/fetch-toss-plans.mjs > data/carriers/toss/raw/toss-2026-09-01.json
const res = await fetch('https://api-public.toss.im/api/v3/mvno-growth/products/homepage', {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
    Referer: 'https://tossmobile.co.kr/pricing',
  },
})
const json = await res.json()
if (json.resultType !== 'SUCCESS') throw new Error('resultType=' + json.resultType)
console.error(`plans: ${json.success.length}`)
process.stdout.write(JSON.stringify(json.success, null, 1))
