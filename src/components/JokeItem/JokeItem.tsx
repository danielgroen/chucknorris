import type { JokeItemProps } from './JokeItem.types'

const JokeItem = ({ joke, isFavorite, canAddFavorite, onToggleFavorite }: JokeItemProps) => {
  const canToggle = isFavorite || canAddFavorite

  return (
    <li className="flex items-start gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors duration-150 group">
      <p className="flex-1 text-gray-100 leading-relaxed">{joke.value}</p>
      <button
        onClick={() => onToggleFavorite(joke)}
        disabled={!canToggle}
        title={
          isFavorite
            ? 'Remove from favorites'
            : canAddFavorite
              ? 'Add to favorites'
              : 'Favorites list is full'
        }
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={`flex-shrink-0 text-2xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded
          ${isFavorite ? 'text-yellow-400' : 'text-gray-600 group-hover:text-gray-400'}
          ${!canToggle ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
        `}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </li>
  )
}

export default JokeItem
