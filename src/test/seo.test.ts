import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { faqItems } from '../data/faq'

interface FaqPageJsonLd {
  '@type': string
  mainEntity: { name: string; acceptedAnswer: { text: string } }[]
}

const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim()

function readIndexHtml(): string {
  return readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
}

function readFaqJsonLd(): FaqPageJsonLd | undefined {
  const blocks = [...readIndexHtml().matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const parsed = blocks.map((match) => JSON.parse(match[1] ?? '{}') as unknown)
  return (parsed as FaqPageJsonLd[]).find((item) => item['@type'] === 'FAQPage')
}

describe('SEO: index.html', () => {
  it('incluye JSON-LD del tipo Organization y FAQPage', () => {
    const html = readIndexHtml()
    expect(html).toMatch(/"@type":\s*"Organization"/)
    expect(readFaqJsonLd()).toBeDefined()
  })

  it('mantiene sincronizado el JSON-LD FAQPage con las preguntas del componente Faq', () => {
    const faqPage = readFaqJsonLd()
    expect(faqPage).toBeDefined()
    if (!faqPage) return

    expect(faqPage.mainEntity).toHaveLength(faqItems.length)

    faqItems.forEach((item, index) => {
      const entry = faqPage.mainEntity[index]
      expect(entry).toBeDefined()
      expect(normalize(entry?.name ?? '')).toBe(normalize(item.question))
      expect(normalize(entry?.acceptedAnswer.text ?? '')).toBe(normalize(item.answer))
    })
  })

  it('usa URLs absolutas en canonical y og:image', () => {
    const html = readIndexHtml()
    expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+"/)
    expect(html).toMatch(/property="og:image" content="https?:\/\/[^"]+"/)
    expect(html).not.toMatch(/fonts\.googleapis\.com/)
  })
})
