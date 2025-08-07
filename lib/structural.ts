/**
 * Computes bending stress from an applied moment and section modulus.
 *
 * @param moment - bending moment (N·m)
 * @param sectionModulus - section modulus of the beam (m^3)
 * @returns Bending stress in pascals (Pa)
 * @throws When `sectionModulus` is zero
 */
export function calculateBendingStress(moment: number, sectionModulus: number): number {
  if (sectionModulus === 0) {
    throw new Error("sectionModulus cannot be zero")
  }
  return moment / sectionModulus
}

/**
 * Calculates midspan deflection for a simply supported beam under uniform load.
 *
 * Uses the formula: δ = 5wL⁴ / (384EI)
 *
 * @param length - beam length (m)
 * @param load - uniform load (N/m)
 * @param modulus - Young's modulus (Pa)
 * @param inertia - second moment of area (m⁴)
 * @returns Deflection in meters
 * @throws When `modulus` or `inertia` is zero
 */
export function deflectionUniformLoad(length: number, load: number, modulus: number, inertia: number): number {
  if (modulus === 0 || inertia === 0) {
    throw new Error("modulus and inertia must be non-zero")
  }
  return (5 * load * Math.pow(length, 4)) / (384 * modulus * inertia)
}
