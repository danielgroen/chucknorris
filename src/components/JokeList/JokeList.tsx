import JokeItem from '@components/JokeItem'
import type { JokeListProps } from './JokeList.types'

const JokeList = ({ items, favorites, canAddFavorite, onToggleFavorite }: JokeListProps) => {
  const favoriteIds = new Set(favorites.map(f => f.id))

  return (
    <ul className="flex flex-col gap-3">
      {items.map(item => (
        <JokeItem
          key={item.listId}
          joke={item.joke}
          isFavorite={favoriteIds.has(item.joke.id)}
          canAddFavorite={canAddFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  )
}

export default JokeList
