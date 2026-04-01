import { describe, it, expect, beforeEach } from 'vitest'
import { getFavorites, saveFavorites } from './storage'
import type { Joke } from '@app-types/Joke.types'

const mockJoke = (id: string): Joke => ({
  id,
  value: `Joke ${id}`,
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: `https://api.chucknorris.io/jokes/${id}`,
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
})

describe('storage.service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getFavorites', () => {
    it('returns empty array when nothing is stored', () => {
      expect(getFavorites()).toEqual([])
    })

    it('returns stored favorites', () => {
      const jokes = [mockJoke('1'), mockJoke('2')]
      localStorage.setItem('chuck_favorites', JSON.stringify(jokes))
      expect(getFavorites()).toEqual(jokes)
    })

    it('returns empty array when stored value is invalid JSON', () => {
      localStorage.setItem('chuck_favorites', 'not-valid-json{{{')
      expect(getFavorites()).toEqual([])
    })

    it('returns empty array when stored value is null', () => {
      localStorage.setItem('chuck_favorites', 'null')
      expect(getFavorites()).toEqual([])
    })
  })

  describe('saveFavorites', () => {
    it('saves favorites to localStorage', () => {
      const jokes = [mockJoke('1')]
      saveFavorites(jokes)
      const raw = localStorage.getItem('chuck_favorites')
      expect(raw).toBe(JSON.stringify(jokes))
    })

    it('overwrites previously saved favorites', () => {
      saveFavorites([mockJoke('1'), mockJoke('2')])
      saveFavorites([mockJoke('3')])
      const result = getFavorites()
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('3')
    })

    it('saves an empty array', () => {
      saveFavorites([])
      expect(getFavorites()).toEqual([])
    })
  })
})
