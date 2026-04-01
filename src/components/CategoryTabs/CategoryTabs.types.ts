export interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onChange: (category: string) => void
}
