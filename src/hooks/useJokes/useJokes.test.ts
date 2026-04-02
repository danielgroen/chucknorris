import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useJokes } from './useJokes'
import { clearJokeCache } from '@services/cache'
import type { Joke } from '@app-types/Joke.types'
import { SpecialCategory } from '@enums'
import { ALL_JOKES_QUERY } from '@consts'

const makeJoke = (id: string): Joke => ({
  id,
  value: `Joke ${id}`,
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: `https://api.chucknorris.io/jokes/${id}`,
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
})

const mockPool = Array.from({ length: 20 }, (_, i) => makeJoke(`pool-${i}`))
const searchResult = { total: mockPool.length, result: mockPool }

const makeFetch = () =>
  vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(searchResult) })

describe('useJokes', () => {
  beforeEach(() => {
    clearJokeCache()
    vi.stubGlobal('fetch', makeFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts in loading state', () => {
    const { result } = renderHook(() => useJokes(SpecialCategory.All))
    expect(result.current.loading).toBe(true)
  })

  describe('All category', () => {
    it('searches with ALL_JOKES_QUERY — exactly one API call', async () => {
      const { result } = renderHook(() => useJokes(SpecialCategory.All))
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        `https://api.chucknorris.io/jokes/search?query=${ALL_JOKES_QUERY}`,
      )
    })

    it('displays 10 jokes from the pool', async () => {
      const { result } = renderHook(() => useJokes(SpecialCategory.All))
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.items).toHaveLength(10)
    })

    it('uses cache on second render — no extra API call', async () => {
      const { result: r1 } = renderHook(() => useJokes(SpecialCategory.All))
      await waitFor(() => expect(r1.current.loading).toBe(false))

      const { result: r2 } = renderHook(() => useJokes(SpecialCategory.All))
      await waitFor(() => expect(r2.current.loading).toBe(false))
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Specific category', () => {
    it('searches with the category name — exactly one API call', async () => {
      const { result } = renderHook(() => useJokes('animal'))
      await waitFor(() => expect(result.current.loading).toBe(false))

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/search?query=animal')
    })

    it('uses cache on second render — no extra API call', async () => {
      const { result: r1 } = renderHook(() => useJokes('animal'))
      await waitFor(() => expect(r1.current.loading).toBe(false))

      const { result: r2 } = renderHook(() => useJokes('animal'))
      await waitFor(() => expect(r2.current.loading).toBe(false))
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('displays up to 10 jokes', async () => {
      const { result } = renderHook(() => useJokes('animal'))
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.items).toHaveLength(10)
    })
  })

  describe('addJoke (timer tick)', () => {
    it('makes zero API calls', async () => {
      const { result } = renderHook(() => useJokes('animal'))
      await waitFor(() => expect(result.current.loading).toBe(false))

      const callsBefore = (fetch as ReturnType<typeof vi.fn>).mock.calls.length
      await act(async () => { await result.current.addJoke() })
      expect((fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(callsBefore)
    })

    it('keeps list at MAX_JOKES and removes the oldest', async () => {
      const { result } = renderHook(() => useJokes('animal'))
      await waitFor(() => expect(result.current.loading).toBe(false))

      const firstListId = result.current.items[0].listId
      await act(async () => { await result.current.addJoke() })
      expect(result.current.items).toHaveLength(10)
      expect(result.current.items.map(i => i.listId)).not.toContain(firstListId)
    })
  })

  it('sets error state when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const { result } = renderHook(() => useJokes('animal'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Failed to load jokes')
  })
})
