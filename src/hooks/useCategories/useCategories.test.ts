import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCategories } from './useCategories'
import { clearJokeCache } from '@services/cache'
import { SpecialCategory } from '@enums'

const mockCategories = ['animal', 'sport', 'dev']

describe('useCategories', () => {
  beforeEach(() => {
    clearJokeCache()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts with only the All tab while loading', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => new Promise(() => {}) }),
    )
    const { result } = renderHook(() => useCategories())
    expect(result.current.categories).toEqual([SpecialCategory.All])
    expect(result.current.loading).toBe(true)
  })

  it('prepends All to the fetched categories', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockCategories) }),
    )
    const { result } = renderHook(() => useCategories())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.categories).toEqual([SpecialCategory.All, ...mockCategories])
  })

  it('falls back to only All when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    const { result } = renderHook(() => useCategories())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.categories).toEqual([SpecialCategory.All])
  })
})
