import type { Joke } from '@app-types/Joke.types'

// Module-level session cache — persists for the lifetime of the page
const categoryJokes = new Map<string, Joke[]>()
let cachedCategories: string[] | null = null

export const getCachedCategories = (): string[] | null => cachedCategories

export const setCachedCategories = (categories: string[]): void => {
  cachedCategories = categories
}

export const getCachedJokes = (category: string): Joke[] | undefined =>
  categoryJokes.get(category)

export const setCachedJokes = (category: string, jokes: Joke[]): void => {
  categoryJokes.set(category, jokes)
}

export const getAllCachedJokes = (): Joke[] =>
  Array.from(categoryJokes.values()).flat()

/** Reset the cache — only intended for use in tests. */
export const clearJokeCache = (): void => {
  categoryJokes.clear()
  cachedCategories = null
}
