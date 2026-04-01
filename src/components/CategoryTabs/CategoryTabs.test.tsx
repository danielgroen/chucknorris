import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryTabs from './CategoryTabs'
import { SpecialCategory } from '@enums'

const categories = [SpecialCategory.All, 'animal', 'sport']

describe('CategoryTabs', () => {
  it('renders a tab for each category', () => {
    render(<CategoryTabs categories={categories} activeCategory={SpecialCategory.All} onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Animal' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Sport' })).toBeInTheDocument()
  })

  it('marks the active category as selected', () => {
    render(<CategoryTabs categories={categories} activeCategory="animal" onChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'Animal' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with the clicked category', async () => {
    const onChange = vi.fn()
    render(<CategoryTabs categories={categories} activeCategory={SpecialCategory.All} onChange={onChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Sport' }))
    expect(onChange).toHaveBeenCalledWith('sport')
  })
})
