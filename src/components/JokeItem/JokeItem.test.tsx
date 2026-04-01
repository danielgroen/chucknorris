import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JokeItem from './JokeItem'
import type { Joke } from '@app-types/Joke.types'

const mockJoke: Joke = {
  id: 'test-1',
  value: 'Chuck Norris can compile syntax errors.',
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: 'https://api.chucknorris.io/jokes/test-1',
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
}

describe('JokeItem', () => {
  it('renders the joke text', () => {
    render(
      <JokeItem
        joke={mockJoke}
        isFavorite={false}
        canAddFavorite={true}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByText(mockJoke.value)).toBeInTheDocument()
  })

  it('shows filled star when joke is a favorite', () => {
    render(
      <JokeItem
        joke={mockJoke}
        isFavorite={true}
        canAddFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).toBeInTheDocument()
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('shows empty star when joke is not a favorite', () => {
    render(
      <JokeItem
        joke={mockJoke}
        isFavorite={false}
        canAddFavorite={true}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeInTheDocument()
    expect(screen.getByText('☆')).toBeInTheDocument()
  })

  it('calls onToggleFavorite when star button is clicked', async () => {
    const user = userEvent.setup()
    const onToggleFavorite = vi.fn()
    render(
      <JokeItem
        joke={mockJoke}
        isFavorite={false}
        canAddFavorite={true}
        onToggleFavorite={onToggleFavorite}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Add to favorites' }))
    expect(onToggleFavorite).toHaveBeenCalledWith(mockJoke)
  })

  it('disables the star button when favorites are full and joke is not a favorite', () => {
    render(
      <JokeItem
        joke={mockJoke}
        isFavorite={false}
        canAddFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Add to favorites' })).toBeDisabled()
  })

  it('does not disable the star button when joke is already a favorite', () => {
    render(
      <JokeItem
        joke={mockJoke}
        isFavorite={true}
        canAddFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Remove from favorites' })).not.toBeDisabled()
  })
})
