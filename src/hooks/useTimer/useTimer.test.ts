import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer'
import { TIMER_INTERVAL_MS } from '@consts'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts as not running', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useTimer(callback))
    expect(result.current.isRunning).toBe(false)
  })

  it('toggle starts the timer', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useTimer(callback))
    act(() => result.current.toggle())
    expect(result.current.isRunning).toBe(true)
  })

  it('toggle stops the timer when it is running', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useTimer(callback))
    act(() => result.current.toggle())
    act(() => result.current.toggle())
    expect(result.current.isRunning).toBe(false)
  })

  it('calls callback at each interval when running', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useTimer(callback))

    act(() => result.current.toggle())
    act(() => vi.advanceTimersByTime(TIMER_INTERVAL_MS))
    expect(callback).toHaveBeenCalledTimes(1)

    act(() => vi.advanceTimersByTime(TIMER_INTERVAL_MS))
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('does not call callback when stopped', () => {
    const callback = vi.fn()
    renderHook(() => useTimer(callback))
    act(() => vi.advanceTimersByTime(TIMER_INTERVAL_MS * 3))
    expect(callback).not.toHaveBeenCalled()
  })

  it('stops calling callback after toggle off', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useTimer(callback))
    act(() => result.current.toggle())
    act(() => vi.advanceTimersByTime(TIMER_INTERVAL_MS))
    expect(callback).toHaveBeenCalledTimes(1)

    act(() => result.current.toggle())
    act(() => vi.advanceTimersByTime(TIMER_INTERVAL_MS * 3))
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('always uses the latest callback reference', () => {
    let value = 0
    const { result, rerender } = renderHook(({ cb }) => useTimer(cb), {
      initialProps: { cb: () => { value = 1 } },
    })
    act(() => result.current.toggle())
    rerender({ cb: () => { value = 2 } })
    act(() => vi.advanceTimersByTime(TIMER_INTERVAL_MS))
    expect(value).toBe(2)
  })
})
