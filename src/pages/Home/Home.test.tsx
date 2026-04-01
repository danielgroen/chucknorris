import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './Home'
import { clearJokeCache } from '@services/cache'
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

const mockCategories = ['animal', 'sport']
const mockPool = Array.from({ length: 20 }, (_, i) => makeJoke(`pool-${i}`))

const mockFetch = (url: string) => {
  if (url.includes('/categories')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve(mockCategories) })
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ total: mockPool.length, result: mockPool }),
  })
}

describe('Home', () => {
  beforeEach(() => {
    clearJokeCache()
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockImplementation(mockFetch))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows loading state initially', () => {
    render(<Home />)
    expect(screen.getByRole('status', { name: 'Loading jokes' })).toBeInTheDocument()
  })

  it('renders jokes list after loading', async () => {
    render(<Home />)
    await waitFor(() => expect(screen.queryByRole('status', { name: 'Loading jokes' })).not.toBeInTheDocument())
    expect(screen.getAllByRole('listitem')).toHaveLength(10)
  })

  it('shows error state when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    render(<Home />)
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Failed to load jokes')).toBeInTheDocument()
  })

  it('renders the timer toggle button', async () => {
    render(<Home />)
    await waitFor(() => expect(screen.queryByRole('status', { name: 'Loading jokes' })).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Start: add a new joke every 5 s' })).toBeInTheDocument()
  })

  it('toggles timer label when clicked', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await waitFor(() => expect(screen.queryByRole('status', { name: 'Loading jokes' })).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Start: add a new joke every 5 s' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Stop: new joke every 5 s' })).toBeInTheDocument())
  })
})
