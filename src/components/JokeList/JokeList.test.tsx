import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import JokeList from './JokeList'
import type { JokeListItem, Joke } from '@app-types/Joke.types'

const makeJoke = (id: string, value: string): Joke => ({
  id,
  value,
  icon_url: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
  url: `https://api.chucknorris.io/jokes/${id}`,
  categories: [],
  created_at: '2020-01-05 13:42:19.324003',
  updated_at: '2020-01-05 13:42:19.324003',
})

const makeItem = (id: string, value: string, index = 0): JokeListItem => ({
  joke: makeJoke(id, value),
  listId: `${id}-${index}`,
  addedAt: Date.now() + index,
})

describe('JokeList', () => {
  it('renders all joke items', () => {
    const items = [
      makeItem('1', 'Chuck Norris joke one', 0),
      makeItem('2', 'Chuck Norris joke two', 1),
      makeItem('3', 'Chuck Norris joke three', 2),
    ]

    render(
      <JokeList
        items={items}
        favorites={[]}
        canAddFavorite={true}
        onToggleFavorite={vi.fn()}
      />,
    )

    expect(screen.getByText('Chuck Norris joke one')).toBeInTheDocument()
    expect(screen.getByText('Chuck Norris joke two')).toBeInTheDocument()
    expect(screen.getByText('Chuck Norris joke three')).toBeInTheDocument()
  })

  it('renders an empty list when items is empty', () => {
    render(
      <JokeList
        items={[]}
        favorites={[]}
        canAddFavorite={true}
        onToggleFavorite={vi.fn()}
      />,
    )
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('marks favorited jokes with filled star', () => {
    const joke = makeJoke('1', 'Favorited joke')
    const items = [makeItem('1', 'Favorited joke', 0)]

    render(
      <JokeList
        items={items}
        favorites={[joke]}
        canAddFavorite={false}
        onToggleFavorite={vi.fn()}
      />,
    )

    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('marks non-favorited jokes with empty star', () => {
    const items = [makeItem('1', 'Non-favorited joke', 0)]

    render(
      <JokeList
        items={items}
        favorites={[]}
        canAddFavorite={true}
        onToggleFavorite={vi.fn()}
      />,
    )

    expect(screen.getByText('☆')).toBeInTheDocument()
  })
})
