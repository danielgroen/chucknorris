import { useState, useEffect } from 'react'
import { fetchCategories } from '@services/api'
import { SpecialCategory } from '@enums'

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([SpecialCategory.All])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
      .then(cats => setCategories([SpecialCategory.All, ...cats]))
      .catch(() => setCategories([SpecialCategory.All]))
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
