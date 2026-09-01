import { expect, test } from 'vitest'
import { won } from './format'

test('won: 천 단위 쉼표 + 원', () => {
  expect(won(348000)).toBe('348,000원')
  expect(won(0)).toBe('0원')
})
