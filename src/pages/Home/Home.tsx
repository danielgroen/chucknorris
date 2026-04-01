import { useState } from 'react'
import { useJokes } from '@hooks/useJokes'
import { useTimer } from '@hooks/useTimer'
import { useFavorites } from '@hooks/useFavorites'
import { useCategories } from '@hooks/useCategories'
import JokeList from '@components/JokeList'
import Button from '@components/Button'
import CategoryTabs from '@components/CategoryTabs'
import { SpecialCategory } from '@enums'
import { MAX_JOKES } from '@consts'

const Home = () => {
  const [activeCategory, setActiveCategory] = useState<string>(SpecialCategory.All)

  const { categories } = useCategories()
  const { items, loading, error, addJoke } = useJokes(activeCategory)
  const { isRunning, toggle } = useTimer(addJoke)
  const { favorites, canAddMore, toggleFavorite } = useFavorites()

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Chuck Norris Jokes</h1>
          <p className="text-gray-400 text-sm mt-1">
            Showing {items.length} of {MAX_JOKES} jokes
          </p>
        </div>
        <Button
          variant={isRunning ? 'danger' : 'primary'}
          onClick={toggle}
          disabled={loading}
          aria-label={isRunning ? 'Stop: new joke every 5 s' : 'Start: add a new joke every 5 s'}
          title={isRunning ? 'Stop adding jokes automatically' : 'Add a new joke every 5 seconds (oldest is removed)'}
        >
          {isRunning ? '⏹ Stop live feed' : '▶ Start live feed'}
        </Button>
      </div>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={handleCategoryChange}
      />

      {isRunning && (
        <div className="mb-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
          Auto-refreshing every 5 seconds — oldest joke is removed when a new one is added.
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4" role="status" aria-label="Loading jokes">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading jokes…</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <JokeList
          items={items}
          favorites={favorites}
          canAddFavorite={canAddMore}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}

export default Home
