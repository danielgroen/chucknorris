import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Favorites from './Favorites'
import type { Joke } from '@app-types/Joke.types'

const makeJoke = (id: string): Joke => ({
  id,
  value: `Joke value ${id}`,
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: `https://api.chucknorris.io/jokes/${id}`,
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
})

describe('Favorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows empty state when there are no favorites', () => {
    render(<Favorites />)
    expect(screen.getByText('No favorites yet.')).toBeInTheDocument()
  })

  it('renders saved favorites from localStorage', () => {
    const jokes = [makeJoke('1'), makeJoke('2')]
    localStorage.setItem('chuck_favorites', JSON.stringify(jokes))
    render(<Favorites />)
    expect(screen.getByText('Joke value 1')).toBeInTheDocument()
    expect(screen.getByText('Joke value 2')).toBeInTheDocument()
  })

  it('shows correct count', () => {
    const jokes = [makeJoke('1'), makeJoke('2')]
    localStorage.setItem('chuck_favorites', JSON.stringify(jokes))
    render(<Favorites />)
    expect(screen.getByText('2 / 10 saved')).toBeInTheDocument()
  })

  it('removes a joke when remove button is clicked', async () => {
    const user = userEvent.setup()
    const jokes = [makeJoke('1'), makeJoke('2')]
    localStorage.setItem('chuck_favorites', JSON.stringify(jokes))
    render(<Favorites />)

    const removeButtons = screen.getAllByRole('button', { name: 'Remove joke from favorites' })
    await user.click(removeButtons[0])

    await waitFor(() => expect(screen.queryByText('Joke value 1')).not.toBeInTheDocument())
    expect(screen.getByText('Joke value 2')).toBeInTheDocument()
  })

  it('shows empty state after all favorites are removed', async () => {
    const user = userEvent.setup()
    localStorage.setItem('chuck_favorites', JSON.stringify([makeJoke('1')]))
    render(<Favorites />)

    await user.click(screen.getByRole('button', { name: 'Remove joke from favorites' }))
    await waitFor(() => expect(screen.getByText('No favorites yet.')).toBeInTheDocument())
  })

  it('persists removal to localStorage', async () => {
    const user = userEvent.setup()
    const jokes = [makeJoke('1'), makeJoke('2')]
    localStorage.setItem('chuck_favorites', JSON.stringify(jokes))
    render(<Favorites />)

    const removeButtons = screen.getAllByRole('button', { name: 'Remove joke from favorites' })
    await user.click(removeButtons[0])

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('chuck_favorites') ?? '[]') as Joke[]
      expect(stored).toHaveLength(1)
    })
  })
})
