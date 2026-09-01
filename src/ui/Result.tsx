import { allPlans } from '../data/loadPlans'
import { recommend, type UserInput } from '../engine/recommend'
import { RULES } from '../engine/rules'
import { won } from './format'

export function Result({ input, onRestart }: { input: UserInput; onRestart: () => void }) {
  const all = recommend(input, allPlans)
  const savers = all.filter((r) => r.annualSaving > 0).slice(0, RULES.topN)
  const best = savers[0]

  return (
    <section className="result">
      {best ? (
        <>
          <p className="headline-label">갈아타면</p>
          <h1 className="big-number">1년에 {won(best.annualSaving)} 아껴요</h1>
          <p className="hint">
            계산: 지금 월 {won(input.currentMonthlyFee)} × 12개월 = 연{' '}
            {won(input.currentMonthlyFee * 12)} 와 아래 요금제의 <strong>1년 실제 납부액</strong>
            (특가 기간 + 제값 기간)을 비교했어요.
          </p>
        </>
      ) : (
        <>
          <h1 className="big-number">지금 요금제가 이미 좋아요</h1>
          <p className="hint">
            조건(데이터{' '}
            {input.dataGBNeeded === Infinity ? '무제한' : `${input.dataGBNeeded}GB`}
            {input.mvnoOk ? '' : ' · 3사만'})에 맞으면서 지금보다 싼 요금제를
            {allPlans.length === 0 ? ' — 아직 요금제 데이터를 모으는 중이에요.' : ' 못 찾았어요.'}
          </p>
        </>
      )}
      <ol className="plan-list">
        {savers.map((r) => (
          <li key={r.plan.id} className="plan-card">
            <div className="plan-head">
              <strong>{r.plan.name}</strong>
              <span className="carrier">
                {r.plan.carrier} · {r.plan.network}망 {r.plan.generation}
              </span>
            </div>
            <div className="plan-fee">
              {r.plan.promo ? (
                <>
                  첫 {r.plan.promo.months}개월 월 {won(r.plan.promo.feeDuring)},{' '}
                  <strong>
                    {r.plan.promo.months + 1}개월째부터 월 {won(r.plan.monthlyFee)}
                  </strong>
                </>
              ) : (
                <>월 {won(r.plan.monthlyFee)}</>
              )}
            </div>
            <div className="plan-detail">
              데이터{' '}
              {r.plan.dataGB === null
                ? '무제한'
                : r.plan.dailyDataGB !== null
                  ? `월 ${r.plan.dataGB}GB + 매일 ${r.plan.dailyDataGB}GB`
                  : `월 ${r.plan.dataGB}GB`}
              {r.plan.throttleMbps !== null && ` (다 쓰면 ${r.plan.throttleMbps}Mbps로 계속)`}
              {' · '}통화 {r.plan.voiceMinutes === null ? '무제한' : `월 ${r.plan.voiceMinutes}분`}
            </div>
            {r.plan.carrierType === 'mno' && (
              <div className="plan-detail">
                참고: 24개월 선택약정을 하면 25% 할인 — 월 약{' '}
                {won(Math.floor((r.plan.monthlyFee * (1 - RULES.mnoContractDiscountRate)) / 10) * 10)}
                (계산과 순위는 약정 없는 정가 기준이에요)
              </div>
            )}
            <div className="plan-annual">
              1년 납부액 {won(r.annualCost)} → <strong>{won(r.annualSaving)} 아껴요</strong>
            </div>
            <a className="source-badge" href={r.plan.sourceUrl} target="_blank" rel="noreferrer">
              원문 보기 · 확인 {r.plan.checkedAt}
            </a>
          </li>
        ))}
      </ol>
      <button className="restart" onClick={onRestart}>
        처음부터 다시
      </button>
    </section>
  )
}
