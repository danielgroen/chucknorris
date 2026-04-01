import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test-utils'
import NavBar from './NavBar'

describe('NavBar', () => {
  it('renders the brand name', () => {
    renderWithRouter(<NavBar />)
    expect(screen.getByText('Chuck Norris Jokes')).toBeInTheDocument()
  })

  it('renders Home link', () => {
    renderWithRouter(<NavBar />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('renders Favorites link', () => {
    renderWithRouter(<NavBar />)
    expect(screen.getByRole('link', { name: 'Favorites' })).toBeInTheDocument()
  })

  it('Home link points to /', () => {
    renderWithRouter(<NavBar />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  })

  it('Favorites link points to /favorites', () => {
    renderWithRouter(<NavBar />)
    expect(screen.getByRole('link', { name: 'Favorites' })).toHaveAttribute('href', '/favorites')
  })

  it('highlights Home link when on home route', () => {
    renderWithRouter(<NavBar />, { initialEntry: '/' })
    expect(screen.getByRole('link', { name: 'Home' }).className).toContain('bg-yellow-500')
  })

  it('highlights Favorites link when on favorites route', () => {
    renderWithRouter(<NavBar />, { initialEntry: '/favorites' })
    expect(screen.getByRole('link', { name: 'Favorites' }).className).toContain('bg-yellow-500')
  })
})
