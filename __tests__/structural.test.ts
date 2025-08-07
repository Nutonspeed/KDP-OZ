import { calculateBendingStress, deflectionUniformLoad } from "../lib/structural"

test('calculates bending stress', () => {
  expect(calculateBendingStress(5000, 50)).toBe(100)
})

test('calculates deflection for uniform load', () => {
  const delta = deflectionUniformLoad(2, 1000, 2e11, 8.333e-6)
  const expected = (5 * 1000 * Math.pow(2, 4)) / (384 * 2e11 * 8.333e-6)
  expect(delta).toBeCloseTo(expected)
})
