import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick} disabled>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-yellow-500')
  })

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-gray-700')
  })

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Danger</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-red-600')
  })

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-transparent')
  })

  it('applies sm size classes', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button').className).toContain('text-sm')
  })

  it('applies lg size classes', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button').className).toContain('text-lg')
  })

  it('merges additional className', () => {
    render(<Button className="extra-class">Button</Button>)
    expect(screen.getByRole('button').className).toContain('extra-class')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Button</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
