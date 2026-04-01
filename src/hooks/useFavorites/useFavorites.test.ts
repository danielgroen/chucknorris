import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'
import type { Joke } from '@app-types/Joke.types'

const makeJoke = (id: string): Joke => ({
  id,
  value: `Joke ${id}`,
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: `https://api.chucknorris.io/jokes/${id}`,
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
})

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with empty favorites when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('loads existing favorites from localStorage on mount', () => {
    const jokes = [makeJoke('1'), makeJoke('2')]
    localStorage.setItem('chuck_favorites', JSON.stringify(jokes))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toHaveLength(2)
  })

  it('isFavorite returns false for unknown joke', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('unknown')).toBe(false)
  })

  it('isFavorite returns true for added joke', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(makeJoke('1')))
    expect(result.current.isFavorite('1')).toBe(true)
  })

  it('toggleFavorite adds a joke to favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(makeJoke('1')))
    expect(result.current.favorites).toHaveLength(1)
  })

  it('toggleFavorite removes a joke that is already a favorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(makeJoke('1')))
    act(() => result.current.toggleFavorite(makeJoke('1')))
    expect(result.current.favorites).toHaveLength(0)
  })

  it('toggleFavorite persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(makeJoke('1')))
    const stored = JSON.parse(localStorage.getItem('chuck_favorites') ?? '[]') as Joke[]
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('1')
  })

  it('does not add more than MAX_FAVORITES (10)', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      for (let i = 1; i <= 11; i++) {
        result.current.toggleFavorite(makeJoke(String(i)))
      }
    })
    expect(result.current.favorites).toHaveLength(10)
    expect(result.current.canAddMore).toBe(false)
  })

  it('canAddMore is true when below limit', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.canAddMore).toBe(true)
  })

  it('removeFavorite removes the correct joke', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.toggleFavorite(makeJoke('1'))
      result.current.toggleFavorite(makeJoke('2'))
    })
    act(() => result.current.removeFavorite('1'))
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe('2')
  })

  it('removeFavorite persists change to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(makeJoke('1')))
    act(() => result.current.removeFavorite('1'))
    const stored = JSON.parse(localStorage.getItem('chuck_favorites') ?? '[]') as Joke[]
    expect(stored).toHaveLength(0)
  })
})
