import { verifyProperty, type Property } from '../src/proof/spec'

class AlwaysTrue implements Property<number> {
  check(_: number): boolean {
    return true
  }
}

const zeros = (): number => 0

test('verifyProperty passes on trivial case', () => {
  const result = verifyProperty('trivial', new AlwaysTrue(), zeros, 10)
  expect(result.passed).toBe(true)
  expect(result.name).toBe('trivial')
})

