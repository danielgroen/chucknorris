import type { Joke } from '@app-types/Joke.types'

export interface JokeItemProps {
  joke: Joke
  isFavorite: boolean
  canAddFavorite: boolean
  onToggleFavorite: (joke: Joke) => void
}
