import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from './test-utils'
import App from './App'
import { clearJokeCache } from '@services/cache'
import type { Joke } from '@app-types/Joke.types'

const makeJoke = (id: string): Joke => ({
  id,
  value: `Joke ${id}`,
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

describe('App', () => {
  beforeEach(() => {
    clearJokeCache()
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockImplementation(mockFetch))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the NavBar', () => {
    renderWithRouter(<App />)
    expect(screen.getAllByText('Chuck Norris Jokes').length).toBeGreaterThanOrEqual(1)
  })

  it('renders Home page on / route', async () => {
    renderWithRouter(<App />)
    await waitFor(() =>
      expect(screen.queryByRole('status', { name: 'Loading jokes' })).not.toBeInTheDocument(),
    )
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('renders Favorites page on /favorites route', () => {
    renderWithRouter(<App />, { initialEntry: '/favorites' })
    expect(screen.getByText('No favorites yet.')).toBeInTheDocument()
  })
})
