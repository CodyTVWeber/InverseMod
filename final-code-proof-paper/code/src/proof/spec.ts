export interface Property<T = unknown> {
  check(candidate: T): boolean
}

export type GeneratorFn<T> = () => T

export interface ProofResult {
  name: string
  passed: boolean
  message?: string
  trials?: number
  counterexamples?: T[]
}

export function verifyProperty<T>(
  propertyName: string,
  propertyUnderTest: Property<T>,
  generator: GeneratorFn<T>,
  numTrials = 1000
): ProofResult {
  let passed = true
  const counterexamples: T[] = []
  for (let i = 0; i < Math.max(1, numTrials); i++) {
    const candidate = generator()
    if (!propertyUnderTest.check(candidate)) {
      passed = false
      counterexamples.push(candidate)
    }
  }
  return {
    name: propertyName,
    passed,
    trials: numTrials,
    counterexamples: counterexamples.length > 0 ? counterexamples : undefined
  }
}

