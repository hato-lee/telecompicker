import { useState } from 'react'
import type { UserInput } from '../engine/recommend'

type Next = (p: Partial<UserInput>) => void

const NETWORKS: UserInput['currentNetwork'][] = ['SKT', 'KT', 'LGU+', '알뜰폰']
const FEE_CHOICES = [
  { label: '3만 원쯤', value: 30000 },
  { label: '5만 원쯤', value: 50000 },
  { label: '7만 원쯤', value: 70000 },
  { label: '9만 원 넘게', value: 90000 },
]

export function ScreenCarrierFee({ onNext }: { onNext: Next }) {
  const [network, setNetwork] = useState<UserInput['currentNetwork'] | null>(null)
  const [custom, setCustom] = useState('')
  return (
    <section>
      <h1>지금 어디서, 한 달에 얼마쯤 내세요?</h1>
      <div className="btn-grid">
        {NETWORKS.map((n) => (
          <button
            key={n}
            className={network === n ? 'choice on' : 'choice'}
            onClick={() => setNetwork(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {network && (
        <>
          <p className="hint">휴대폰 요금만요 — 기기 할부금은 빼고 생각해 주세요.</p>
          <div className="btn-grid">
            {FEE_CHOICES.map((f) => (
              <button
                key={f.value}
                className="choice"
                onClick={() => onNext({ currentNetwork: network, currentMonthlyFee: f.value })}
              >
                {f.label}
              </button>
            ))}
          </div>
          <details className="side-door">
            <summary>정확한 금액을 알아요</summary>
            <input
              inputMode="numeric"
              placeholder="예: 55000"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <button
              disabled={!/^\d{3,7}$/.test(custom)}
              onClick={() => onNext({ currentNetwork: network, currentMonthlyFee: Number(custom) })}
            >
              이 금액으로
            </button>
          </details>
        </>
      )}
    </section>
  )
}

const DATA_CHOICES = [
  { label: '조금만', sub: '5GB 이하 — 카톡·검색 위주', value: 5 },
  { label: '보통', sub: '15GB쯤 — 음악·웹서핑 자주', value: 15 },
  { label: '많이', sub: '50GB쯤 — 와이파이 없이 영상도', value: 50 },
  { label: '무제한이 필요해요', sub: '데이터 걱정 없이', value: Infinity },
]

export function ScreenData({ onNext }: { onNext: Next }) {
  return (
    <section>
      <h1>한 달에 데이터를 얼마나 쓰세요?</h1>
      <p className="hint">잘 모르면 휴대폰 설정의 「데이터 사용량」에서 볼 수 있어요.</p>
      <div className="btn-col">
        {DATA_CHOICES.map((d) => (
          <button key={d.label} className="choice" onClick={() => onNext({ dataGBNeeded: d.value })}>
            {d.label} <small>{d.sub}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

const VOICE_CHOICES: { label: string; value: UserInput['voice']; hint: string }[] = [
  { label: '거의 안 해요', value: 'low', hint: '한 달 100분이면 충분' },
  { label: '보통이에요', value: 'mid', hint: '한 달 300분쯤' },
  { label: '많이 해요', value: 'high', hint: '무제한이 마음 편해요' },
]

export function ScreenVoice({ onNext }: { onNext: Next }) {
  return (
    <section>
      <h1>전화 통화는 많이 하세요?</h1>
      <div className="btn-col">
        {VOICE_CHOICES.map((v) => (
          <button key={v.value} className="choice" onClick={() => onNext({ voice: v.value })}>
            {v.label} <small>{v.hint}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

const AGE_CHOICES: { label: string; sub: string; value: NonNullable<UserInput['age']> }[] = [
  { label: '만 18세 이하', sub: '청소년 요금제까지 비교', value: { min: 0, max: 18 } },
  { label: '만 19~34세', sub: '청년 요금제까지 비교', value: { min: 19, max: 34 } },
  { label: '만 35~64세', sub: '', value: { min: 35, max: 64 } },
  { label: '만 65세 이상', sub: '시니어 요금제까지 비교', value: { min: 65, max: null } },
]

export function ScreenAge({ onNext }: { onNext: Next }) {
  const [custom, setCustom] = useState('')
  return (
    <section>
      <h1>나이가 어떻게 되세요?</h1>
      <p className="hint">
        청년·시니어 전용처럼 나이에 따라 가입되는 요금제가 있어서 여쭤봐요. 나이는 저장하지 않아요.
      </p>
      <div className="btn-col">
        {AGE_CHOICES.map((a) => (
          <button key={a.label} className="choice" onClick={() => onNext({ age: a.value })}>
            {a.label} {a.sub && <small>{a.sub}</small>}
          </button>
        ))}
      </div>
      <details className="side-door">
        <summary>정확한 만 나이를 알려드릴게요</summary>
        <input
          inputMode="numeric"
          placeholder="예: 27"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />
        <button
          disabled={!/^\d{1,3}$/.test(custom) || Number(custom) > 120}
          onClick={() => onNext({ age: { min: Number(custom), max: Number(custom) } })}
        >
          이 나이로
        </button>
      </details>
    </section>
  )
}

export function ScreenMvno({ onNext }: { onNext: Next }) {
  return (
    <section>
      <h1>알뜰폰도 괜찮으세요?</h1>
      <p className="hint">
        알뜰폰은 통신 3사의 통신망을 그대로 빌려 써요. 통화 품질은 같고, 멤버십·가족결합이 없는 대신
        요금이 싸요.
      </p>
      <div className="btn-col">
        <button className="choice" onClick={() => onNext({ mvnoOk: true })}>
          네, 싸면 좋죠
        </button>
        <button className="choice" onClick={() => onNext({ mvnoOk: false })}>
          아니요, 3사가 좋아요
        </button>
      </div>
    </section>
  )
}
