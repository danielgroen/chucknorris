import { useFavorites } from '@hooks/useFavorites'
import Button from '@components/Button'
import { MAX_FAVORITES } from '@consts'

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Favorites</h1>
          <p className="text-gray-400 text-sm mt-1">
            {favorites.length} / {MAX_FAVORITES} saved
          </p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="text-5xl">☆</span>
          <p className="text-gray-400 text-lg">No favorites yet.</p>
          <p className="text-gray-600 text-sm">
            Go to the home page and star jokes you like!
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {favorites.map(joke => (
            <li
              key={joke.id}
              className="flex items-start gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors duration-150"
            >
              <span className="text-yellow-400 text-xl flex-shrink-0 mt-0.5">★</span>
              <p className="flex-1 text-gray-100 leading-relaxed">{joke.value}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFavorite(joke.id)}
                aria-label={`Remove joke from favorites`}
                title="Remove from favorites"
              >
                ✕
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Favorites
