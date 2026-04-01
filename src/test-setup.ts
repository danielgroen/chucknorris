import '@testing-library/jest-dom'
import { beforeEach, afterEach, vi } from 'vitest'

// React 18 concurrent mode emits act() warnings for state updates that resolve
// in microtasks after userEvent's act() boundary closes. This is a known false-positive
// when using @testing-library/user-event v14 with React 18.
// See: https://github.com/testing-library/react-testing-library/issues/1051
const originalConsoleError = console.error

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return
    originalConsoleError(...args)
  })
})

afterEach(() => {
  vi.mocked(console.error).mockRestore()
})
