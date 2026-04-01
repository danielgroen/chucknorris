import { StorageKey } from '@enums'
import type { Joke } from '@app-types/Joke.types'

export const getFavorites = (): Joke[] => {
  try {
    const raw = localStorage.getItem(StorageKey.Favorites)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Joke[]) : []
  } catch {
    return []
  }
}

export const saveFavorites = (favorites: Joke[]): void => {
  localStorage.setItem(StorageKey.Favorites, JSON.stringify(favorites))
}
