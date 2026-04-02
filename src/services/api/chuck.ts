import { API_BASE_URL } from '@consts'
import {
  getCachedCategories,
  setCachedCategories,
  getCachedJokes,
  setCachedJokes,
} from '@services/cache'
import type { Joke, JokeSearchResult } from '@app-types/Joke.types'

export const fetchCategories = async (): Promise<string[]> => {
  const cached = getCachedCategories()
  if (cached) return cached

  const response = await fetch(`${API_BASE_URL}/categories`)
  if (!response.ok) throw new Error('Failed to fetch categories')
  const categories = (await response.json()) as string[]
  setCachedCategories(categories)
  return categories
}

export const fetchJokesByCategory = async (category: string): Promise<Joke[]> => {
  const cached = getCachedJokes(category)
  if (cached) return cached

  const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(category)}`)
  if (!response.ok) throw new Error('Failed to fetch jokes')
  const data = (await response.json()) as JokeSearchResult
  setCachedJokes(category, data.result)
  return data.result
}
