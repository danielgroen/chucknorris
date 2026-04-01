import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from './test-utils'
import App from './App'
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

let callCount = 0
const mockFetch = () => {
  callCount++
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(makeJoke(`id-${callCount}`)),
  })
}

describe('App', () => {
  beforeEach(() => {
    callCount = 0
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
