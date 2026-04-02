import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchCategories, fetchJokesByCategory } from './chuck'
import { clearJokeCache } from '@services/cache'
import type { Joke } from '@app-types/Joke.types'

const mockJoke: Joke = {
  id: 'test-id-1',
  value: 'Chuck Norris can divide by zero.',
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: 'https://api.chucknorris.io/jokes/test-id-1',
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
}

const mockCategories = ['animal', 'career', 'sport']
const searchResult = { total: 2, result: [mockJoke, { ...mockJoke, id: 'test-id-2' }] }

const createMockFetch = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({ ok, json: () => Promise.resolve(body) })

describe('chuck.api', () => {
  beforeEach(() => {
    clearJokeCache()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchCategories', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', createMockFetch(mockCategories))
    })

    it('returns an array of category strings', async () => {
      expect(await fetchCategories()).toEqual(mockCategories)
    })

    it('calls the correct endpoint', async () => {
      await fetchCategories()
      expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/categories')
    })

    it('caches the result — second call makes no API request', async () => {
      await fetchCategories()
      await fetchCategories()
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('throws when response is not ok', async () => {
      vi.stubGlobal('fetch', createMockFetch(null, false))
      await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories')
    })
  })

  describe('fetchJokesByCategory', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', createMockFetch(searchResult))
    })

    it('returns the result array from the search response', async () => {
      expect(await fetchJokesByCategory('animal')).toEqual(searchResult.result)
    })

    it('calls the search endpoint with the encoded category', async () => {
      await fetchJokesByCategory('animal')
      expect(fetch).toHaveBeenCalledWith('https://api.chucknorris.io/jokes/search?query=animal')
    })

    it('caches the result — second call makes no API request', async () => {
      await fetchJokesByCategory('animal')
      await fetchJokesByCategory('animal')
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('fetches different categories separately', async () => {
      await fetchJokesByCategory('animal')
      await fetchJokesByCategory('sport')
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('throws when response is not ok', async () => {
      vi.stubGlobal('fetch', createMockFetch(null, false))
      await expect(fetchJokesByCategory('animal')).rejects.toThrow('Failed to fetch jokes')
    })
  })
})
