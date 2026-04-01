import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const

interface RenderWithRouterOptions {
  initialEntry?: string
}

export const renderWithRouter = (ui: ReactNode, { initialEntry = '/' }: RenderWithRouterOptions = {}) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]} future={routerFutureFlags}>
      {ui}
    </MemoryRouter>,
  )
