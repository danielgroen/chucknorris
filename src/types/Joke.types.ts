export interface Joke {
  id: string
  value: string
  icon_url: string
  url: string
  categories: string[]
  created_at: string
  updated_at: string
}

export interface JokeSearchResult {
  total: number
  result: Joke[]
}

export interface JokeListItem {
  joke: Joke
  listId: string
  addedAt: number
}
