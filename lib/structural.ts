export function calculateBendingStress(moment: number, sectionModulus: number) {
  if (sectionModulus === 0) {
    throw new Error("sectionModulus cannot be zero")
  }
  return moment / sectionModulus
}

export function deflectionUniformLoad(length: number, load: number, modulus: number, inertia: number) {
  if (modulus === 0 || inertia === 0) {
    throw new Error("modulus and inertia must be non-zero")
  }
  return (5 * load * Math.pow(length, 4)) / (384 * modulus * inertia)
}
