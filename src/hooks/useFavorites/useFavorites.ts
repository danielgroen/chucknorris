import { useState, useCallback } from 'react'
import { getFavorites, saveFavorites } from '@services/storage'
import { MAX_FAVORITES } from '@consts'
import type { Joke } from '@app-types/Joke.types'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Joke[]>(getFavorites)

  const isFavorite = useCallback((id: string) => favorites.some(f => f.id === id), [favorites])

  const canAddMore = favorites.length < MAX_FAVORITES

  const toggleFavorite = useCallback((joke: Joke) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === joke.id)
      let next: Joke[]
      if (exists) {
        next = prev.filter(f => f.id !== joke.id)
      } else if (prev.length < MAX_FAVORITES) {
        next = [...prev, joke]
      } else {
        return prev
      }
      saveFavorites(next)
      return next
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id)
      saveFavorites(next)
      return next
    })
  }, [])

  return { favorites, isFavorite, canAddMore, toggleFavorite, removeFavorite }
}
