import { useState } from 'react'
import { LogoMark } from '../Logo'
import { faqItems } from '../../data/faq'

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <LogoMark tone="dark" className="h-4 w-4" alt="" />
            Dudas frecuentes
          </span>
          <h2 className="section-title mt-6">
            Preguntas <span className="text-brand-300">frecuentes</span>
          </h2>
          <p className="mt-5 text-white/60">
            Lo que más nos preguntan antes de postular. Si te falta algo, escríbenos y te respondemos
            en menos de 48 h (máximo 3 días).
          </p>
        </div>

        <ul className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            const questionId = `faq-question-${index}`
            const answerId = `faq-answer-${index}`

            return (
              <li
                key={item.question}
                className="animate-fade-up rounded-2xl border border-white/10 bg-ink-800/60 px-6 backdrop-blur-xl transition hover:border-brand-400/40"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <h3>
                  <button
                    type="button"
                    id={questionId}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-semibold text-white transition hover:text-brand-200"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className={`grid h-7 w-7 flex-none place-items-center rounded-full border text-brand-200 transition duration-300 ${
                        isOpen
                          ? 'rotate-45 border-brand-300 bg-brand-500/30'
                          : 'border-brand-400/40 bg-brand-500/15'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div id={answerId} role="region" aria-labelledby={questionId} hidden={!isOpen}>
                  <p className="pb-5 pr-10 text-sm leading-relaxed text-white/70">{item.answer}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
