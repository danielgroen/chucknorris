import { SpecialCategory } from '@enums'
import type { CategoryTabsProps } from './CategoryTabs.types'

const labelFor = (category: string): string =>
  category === SpecialCategory.All
    ? 'All'
    : category.charAt(0).toUpperCase() + category.slice(1)

const CategoryTabs = ({ categories, activeCategory, onChange }: CategoryTabsProps) => (
  <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Joke categories">
    {categories.map(category => {
      const isActive = category === activeCategory
      return (
        <button
          key={category}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(category)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-950 capitalize
            ${
              isActive
                ? 'bg-yellow-500 text-gray-950'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100'
            }
          `}
        >
          {labelFor(category)}
        </button>
      )
    })}
  </div>
)

export default CategoryTabs
