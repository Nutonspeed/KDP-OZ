function sum(a: number, b: number) {
  return a + b;
}

test('adds numbers', () => {
  expect(sum(1, 2)).toBe(3);
});
