import type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-semibold',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
