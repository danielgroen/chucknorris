import type { JokeListItem, Joke } from '@app-types/Joke.types'

export interface JokeListProps {
  items: JokeListItem[]
  favorites: Joke[]
  canAddFavorite: boolean
  onToggleFavorite: (joke: Joke) => void
}
