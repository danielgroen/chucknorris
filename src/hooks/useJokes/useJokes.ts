import { useState, useEffect, useCallback } from 'react'
import { fetchJokesByCategory } from '@services/api'
import { MAX_JOKES, JOKES_INITIAL_COUNT, ALL_JOKES_QUERY } from '@consts'
import { SpecialCategory } from '@enums'
import type { Joke, JokeListItem } from '@app-types/Joke.types'

const toListItem = (joke: Joke, salt = 0): JokeListItem => ({
  joke,
  listId: `${joke.id}-${Date.now()}-${salt}`,
  addedAt: Date.now() + salt,
})

const pickRandom = (pool: Joke[], count: number): Joke[] =>
  [...pool].sort(() => Math.random() - 0.5).slice(0, count)

const trimToMax = (items: JokeListItem[]): JokeListItem[] =>
  items.length > MAX_JOKES ? items.slice(items.length - MAX_JOKES) : items

export const useJokes = (category: string) => {
  const [items, setItems] = useState<JokeListItem[]>([])
  const [pool, setPool] = useState<Joke[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchQuery = category === SpecialCategory.All ? ALL_JOKES_QUERY : category

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchJokesByCategory(searchQuery)
      .then(jokes => {
        setPool(jokes)
        setItems(pickRandom(jokes, JOKES_INITIAL_COUNT).map((joke, i) => toListItem(joke, i)))
      })
      .catch(() => setError('Failed to load jokes'))
      .finally(() => setLoading(false))
  }, [searchQuery])

  // Timer tick — always picks from in-memory pool, zero API calls
  const addJoke = useCallback(async () => {
    setItems(prev => {
      if (pool.length === 0) return prev
      const joke = pool[Math.floor(Math.random() * pool.length)]
      return trimToMax([...prev, toListItem(joke)])
    })
  }, [pool])

  return { items, loading, error, addJoke }
}
