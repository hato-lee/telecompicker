import { useState } from 'react'
import type { UserInput } from '../engine/recommend'
import { ScreenCarrierFee, ScreenData, ScreenVoice, ScreenAge, ScreenMvno } from './screens'
import { Result } from './Result'

type Step = 0 | 1 | 2 | 3 | 4 | 5

export function App() {
  const [step, setStep] = useState<Step>(0)
  const [input, setInput] = useState<Partial<UserInput>>({})

  const patch = (p: Partial<UserInput>, next: Step) => {
    setInput((prev) => ({ ...prev, ...p }))
    setStep(next)
  }

  return (
    <main className="wizard">
      <header className="brand-bar">통신비피커</header>
      {step < 5 && (
        <div className="progress" aria-label={`5단계 중 ${step + 1}단계`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={i <= step ? 'dot on' : 'dot'} />
          ))}
        </div>
      )}
      {step > 0 && step < 5 && (
        <button className="back" onClick={() => setStep((step - 1) as Step)}>
          ← 이전
        </button>
      )}
      {step === 0 && <ScreenCarrierFee onNext={(p) => patch(p, 1)} />}
      {step === 1 && <ScreenData onNext={(p) => patch(p, 2)} />}
      {step === 2 && <ScreenVoice onNext={(p) => patch(p, 3)} />}
      {step === 3 && <ScreenAge onNext={(p) => patch(p, 4)} />}
      {step === 4 && <ScreenMvno onNext={(p) => patch(p, 5)} />}
      {step === 5 && (
        <Result
          input={input as UserInput}
          onRestart={() => {
            setInput({})
            setStep(0)
          }}
        />
      )}
    </main>
  )
}
